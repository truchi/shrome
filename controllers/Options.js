// requires options/models/Config.js
// requires options/models/Shrome.js
// requires options/controllers/Request.js

class Options {
  constructor({ git, table }) {
    this.git   = git
    this.table = table

    this.shromeFileSuccess = this.shromeFileSuccess.bind(this)
    this.shromeFileFail    = this.shromeFileFail   .bind(this)

    this.attach()

    Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => this.renderConfig({ ...config, data: shrome.data }))
  }

  attach() {
    this.git.$dispatcher.addEventListener('git:form', ({ detail: { user, repo } }) => {
      if (user && repo) {
        Request.getShromeFile(user, repo)
          .then (this.shromeFileSuccess)
          .catch(this.shromeFileFail)
      } else {
        this.shromeFileFail()
      }
    })

    this.table.$dispatcher.addEventListener('table:theme', ({ detail: { theme } }) => Config.save({ theme }))
  }

  renderConfig({ user, repo, theme, data }) {
    this.git  .render({ user, repo  })
    this.table.render({ data, theme })
  }

  shromeFileSuccess({ user, repo, sha, data }) {
    data = JSON.parse(data)

    const shrome = new Shrome({ data })
    shrome.save()
    Config.save({ user, repo, sha })

    this.git  .render({ ok: true })
    this.table.render(data)
  }

  shromeFileFail(message) {
    this.git.render({ ok: false, message })
  }
}

window.Options = Options
