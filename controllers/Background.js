// requires 'models/Config.js'
// requires 'models/Shrome.js'
// requires 'controllers/Request.js'

class Background {
  constructor() {
    this.config = null
    this.shrome = null

    this.dataPromise = Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this.config = config
        this.shrome = shrome
      })
  }

  onCompleted(navigation) {
    this.dataPromise.then(() => this._onCompleted(navigation))
  }

  _onCompleted(navigation) {
    if (navigation.frameId !== 0) return
    const id  = navigation.tabId
    const url = navigation.url

    const files = this.shrome.files(url, this.config.theme, this.config.local)
    const base  = (file) => this.config.local
      ? this.config.url + file
      : Request.githubFileUrl(this.config.user, this.config.repo, this.config.sha, file)

    Promise.all([
      Promise.all(files.js .map(js  => Request.get(base(js )))),
      Promise.all(files.css.map(css => Request.get(base(css))))
    ])
      .then(([ js, css ]) => {
        chrome.tabs.sendMessage(id, { files: { js, css } })
      })
  }
}


window.Background = Background
