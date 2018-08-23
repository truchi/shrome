import Helpers from '../Helpers.js'
import Config  from '../models/Config.js'
import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

export default class Background {
  constructor() {
    this._config = null
    this._shrome = null

    this._attach      = this._attach     .bind(this)
    this._injectAll   = this._injectAll  .bind(this)
    this._onCompleted = this._onCompleted.bind(this)
    this._onMessage   = this._onMessage  .bind(this)

    this._load()
      .then(this._attach)
  }

  _load() {
    return Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this._config = config
        this._shrome = shrome
      })
  }

  _attach() {
    chrome.webNavigation.onCompleted.addListener(this._onCompleted)
    chrome.runtime      .onMessage  .addListener(this._onMessage  )
  }

  _injectAll() {
    chrome.windows.getAll({ populate: true }, (windows) =>
      windows.forEach(window => window.tabs.forEach(tab => this._inject(tab.id, tab.url)))
    )
  }

  _inject(id, url) {
    this._getFiles(url)
      .then(files => {
        console.log(files)
        chrome.tabs.sendMessage(id, files)
      })
  }

  _getFiles(url) {
    const results = { js: [], css: [], fail: {} }
    const { matches, files }   = this._shrome.files(url, this._config.theme)
    console.log(matches, files)
    const base    = (file) => this._config.local
      ? Request.makeUrl(this._config.url, file)
      : Request.githubFileUrl(this._config.user, this._config.repo, this._config.sha, file)

    const promises = Object.entries(Helpers.groupBy(files, 'file')).map(([ file,  data ]) =>
      Request.get(file = base(file))
        .then   (content => data.forEach(d => d.content = content))
        .catch  (error   => data.forEach(d => d.error   = error  ))
        .finally(()      => data.forEach(d => d.file    = file   ))
    )

    return new Promise(resolve => Promise.all(promises).finally(() => resolve(files)))
  }

  _onCompleted(navigation) {
    if (navigation.frameId !== 0) return
    const id  = navigation.tabId
    const url = navigation.url

    this._inject(id, url)
  }

  _onMessage(message) {
    if (message.reload) this._load().then(this._injectAll)
  }
}
