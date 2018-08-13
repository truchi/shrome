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
    this.dataPromise.then(() => { this._onCompleted(navigation) })
  }

  _onCompleted(navigation) {
    if (navigation.frameId !== 0) return
    const id  = navigation.tabId
    const url = navigation.url

    const files = this.shrome.files(url, this.config.theme)
    chrome.tabs.sendMessage(id, {
      files: {
        js : files.js,
        css: files.css
      }
    })
  }
}


window.Background = Background
