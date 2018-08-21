import Config  from '../models/Config.js'
import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

export default class Background {
  constructor() {
    this.config = null
    this.shrome = null

    Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this.config = config
        this.shrome = shrome
      })
      .then(this.events.bind(this))
  }

  events() {
    chrome.webNavigation.onCompleted.addListener(this.onCompleted.bind(this))
  }

  onCompleted(navigation) {
    if (navigation.frameId !== 0) return
    const id  = navigation.tabId
    const url = navigation.url

    const files = this.shrome.files(url, this.config.theme, this.config.local)
    const base  = (file) => this.config.local
      ? Request.makeUrl(this.config.url, file)
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
