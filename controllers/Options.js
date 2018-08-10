// requires options/models/Config.js
// requires options/models/Shrome.js
// requires options/controllers/Request.js

class Options {
  constructor({ git, table }) {
    this.git   = git
    this.table = table

    this.success = this.success.bind(this)
    this.fail    = this.fail   .bind(this)

    this.attach()

    Promise.all([ Config.get(), Shrome.get() ])
      .then(([ { user, repo }, shrome ]) => this.render(user, repo, shrome.data))
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

  render(user, repo, data) {
    this.git  .render({ user, repo })
    this.table.render(data)
  }

  success({ user, repo, data }) {
    data = JSON.parse(data)

    const shrome = new Shrome({ data })
    shrome.save()
    Config.save({ user, repo })

    this.git  .render({ ok: true })
    this.table.render(data)
  }

  fail(message) {
    this.git.render({ ok: false, message })
  }
}

window.Options = Options
