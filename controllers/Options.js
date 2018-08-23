import Config  from '../models/Config.js'
import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

class Options {
  constructor({ source, config }) {
    this.source = source
    this.config = config
    this._config = Config.default

    this.onSource = this.onSource.bind(this)
    this.onTheme  = this.onTheme .bind(this)

    this.init()
  }

  init() {
    return Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this._config = config

        this.attach()
        this.display({ config, shrome })
      })
      .catch(console.error)
  }

  attach() {
    this.source.on('change', this.onSource)
    this.config.on('theme' , this.onTheme )
  }

  onSource({ detail: { local, user, repo, url } }) {
    let shromeFilePromise
    let config = { ...this._config, local, user, repo, url }

    if (local) {
      shromeFilePromise = new Promise((resolve, reject) =>
        Request.get(Request.makeUrl(url, '.shrome.json'))
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
        chrome.runtime.sendMessage({ reload: true })

        this.saveConfig(config)
        shrome.save()
      })
      .catch((error) => {
        this.display({ config, error })
      })

    return this
  }

  onTheme({ detail: { theme } }) {
    chrome.runtime.sendMessage({ reload: true })

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

    this.source.render({ local, user, repo, url, error })
    this.config.render({ data, theme })
  }

  saveConfig(config) {
    this._config = { ...this._config, ...config }

    return Config.save(this._config)
      .catch(console.error)
  }
}

window.Options = Options
