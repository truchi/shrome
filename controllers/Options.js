// requires options/models/Config.js
// requires options/models/Shrome.js
// requires options/controllers/Request.js

class Options {
  constructor({ shrome, git }) {
    this.git = git

    this.success = this.success.bind(this)
    this.fail    = this.fail   .bind(this)

    this.attach()

    Config.get()
      .then (console.log)
      .catch(console.warn)

    Shrome.get()
      .then (console.log)
      .catch(console.warn)
  }

  attach() {
    this.git.$dispatcher.addEventListener('git:form', ({ detail: { user, repo } }) => {
      if (user && repo) {
        Request.getShromeFile(user, repo)
          .then (this.success)
          .catch(this.fail)
      } else {
        this.fail()
      }
    })
  }

  success({ user, repo, data }) {
    data = JSON.parse(data)

    const shrome = new Shrome({ data })
    shrome.save()
    Config.save({ user, repo })

    this.git.render({ ok: true })
  }

  fail(message) {
    this.git.render({ ok: false, message })
  }
}

window.Options = Options
