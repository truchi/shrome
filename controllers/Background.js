import Config  from '../models/Config.js'
import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

export default class Background {
  constructor() {
    this.config = null
    this.shrome = null

    this.attach      = this.attach     .bind(this)
    this.onCompleted = this.onCompleted.bind(this)

    this.load()
      .then(this.attach)
  }

  load() {
    return Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this.config = config
        this.shrome = shrome
      })
  }

  attach() {
    chrome.webNavigation.onCompleted.addListener(this.onCompleted)
  }

  inject(id, url) {
    this.getFiles(url)
      .then(([ js, css ]) => chrome.tabs.sendMessage(id, { files: { js, css } }))
  }

  getFiles(url) {
    const files = this.shrome.files(url, this.config.theme, this.config.local)
    const base  = (file) => this.config.local
      ? Request.makeUrl(this.config.url, file)
      : Request.githubFileUrl(this.config.user, this.config.repo, this.config.sha, file)

    return Promise.all([
      Promise.all(files.js .map(js  => Request.get(base(js )))),
      Promise.all(files.css.map(css => Request.get(base(css))))
    ])
  }

  onCompleted(navigation) {
    if (navigation.frameId !== 0) return
    const id  = navigation.tabId
    const url = navigation.url

    this.inject(id, url)
  }
}
