// requires options/models/Config.js
// requires options/models/Shrome.js
// requires options/controllers/Request.js

class Options {
  constructor({ git, table }) {
    this.git    = git
    this.table  = table
    this.config = Config.default

    this.onForm  = this.onForm .bind(this)
    this.onTheme = this.onTheme.bind(this)

    this.init()
  }

  init() {
    return Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this.config = config

        this.attach()
        this.display({ config, shrome })
      })
      .catch(console.error)
  }

  attach() {
    this.git  .$dispatcher.addEventListener('git:form'   , this.onForm )
    this.table.$dispatcher.addEventListener('table:theme', this.onTheme)
  }

  onForm({ detail: { local, user, repo, url } }) {
    url = url.replace(/\/+$/, '')

    let shromeFilePromise
    let config = { ...this.config, local, user, repo, url }

    if (local) {
      shromeFilePromise = new Promise((resolve, reject) =>
        Request.get(`${ url }/.shrome.json`)
          .then(data => resolve({ data, sha: Config.default.sha }))
          .catch(reject)
      )
    } else {
      if (!user || !repo) return this.display({
        config,
        error: !user && !repo
          ? 'Please fill user and repo fields'
          : !user
            ? 'Please fill user field'
            : 'Please fill repo field'
      })

      shromeFilePromise = Request.getShromeFile(user, repo)
    }

    shromeFilePromise
      .then(({ data, sha }) => {
        config = { ...config, sha, theme: Config.default.theme }
        data   = JSON.parse(data)
        const shrome = new Shrome({ data })

        this.display({ config, shrome })
        this.saveConfig(config)
        shrome.save()
      })
      .catch((error) => {
        this.display({ config, error })
      })

    return this
  }

  onTheme({ detail: { theme } }) {
    this.saveConfig({ theme })

    return this
  }

  display({ config, shrome = null, error = '' }) {
    const local = config.local
    const user  = config.user
    const repo  = config.repo
    const url   = config.url
    const theme = config.theme
    const data  = shrome ? shrome.data : null

    this.git  .render({ local, user, repo, url, error })
    this.table.render({ data, theme })
  }

  saveConfig(config) {
    this.config = { ...this.config, ...config }

    return Config.save(this.config)
      .catch(console.error)
  }
}

window.Options = Options
