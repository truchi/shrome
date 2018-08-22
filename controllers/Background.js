import Helpers from '../Helpers.js'
import Config  from '../models/Config.js'
import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

export default class Background {
  constructor() {
    this.config = null
    this.shrome = null

    this.attach      = this.attach     .bind(this)
    this.injectAll   = this.injectAll  .bind(this)
    this.onCompleted = this.onCompleted.bind(this)
    this.onMessage   = this.onMessage  .bind(this)

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
    chrome.runtime      .onMessage  .addListener(this.onMessage  )
  }

  injectAll() {
    chrome.windows.getAll({ populate: true }, (windows) =>
      windows.forEach(window => window.tabs.forEach(tab => this.inject(tab.id, tab.url)))
    )
  }

  inject(id, url) {
    this.getFiles(url)
      .then(files => {
        chrome.tabs.sendMessage(id, files)
      })
  }

  getFiles(url) {
    const results = { js: [], css: [], fail: {} }
    const files   = this.shrome.files(url, this.config.theme)
    const base    = (file) => this.config.local
      ? Request.makeUrl(this.config.url, file)
      : Request.githubFileUrl(this.config.user, this.config.repo, this.config.sha, file)

    const promises = Object.entries(Helpers.groupBy(files, 'file')).map(([ file,  data ]) =>
      Request.get(base(file))
        .then   (content => data.forEach(d => d.content = content))
        .catch  (error   => data.forEach(d => d.error   = error  ))
    )

    return new Promise(resolve => Promise.all(promises).finally(() => resolve(files)))
  }

  onCompleted(navigation) {
    if (navigation.frameId !== 0) return
    const id  = navigation.tabId
    const url = navigation.url

    this.inject(id, url)
  }

  onMessage(message) {
    if (message.reload) this.load().then(this.injectAll)
  }
}
