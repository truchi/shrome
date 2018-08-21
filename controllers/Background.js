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
      .then(this.injectAll)
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
      .then(({ js, css, fail }) => {
        chrome.tabs.sendMessage(id, { files: { js, css } })
      })
  }

  getFiles(url) {
    const files = this.shrome.files(url, this.config.theme, this.config.local)
    const base  = (file) => this.config.local
      ? Request.makeUrl(this.config.url, file)
      : Request.githubFileUrl(this.config.user, this.config.repo, this.config.sha, file)

    return new Promise(resolve => {
      const res = { js: [], css: [], fail: [] }
      const map = (key) => (file) => {
        return Request.get(base(file))
          .then (content => res[key].push(content))
          .catch(()      => res.fail.push(file   ))
      }

      const jsPromises  = files.js .map(map('js' ))
      const cssPromises = files.css.map(map('css'))

      Promise.all(jsPromises.concat(cssPromises))
        .finally(() => resolve(res))
    })
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
