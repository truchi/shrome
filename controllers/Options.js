import Config  from '../models/Config.js'
import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

export default class Options {
  constructor({ source, config }) {
    this._source = source
    this._config = config
    this.__config = Config.default

    this._onSource = this._onSource.bind(this)
    this._onTheme  = this._onTheme .bind(this)

    this._init()
  }

  _init() {
    return Promise.all([ Config.get(), Shrome.get() ])
      .then(([ config, shrome ]) => {
        this.__config = config

        this._attach()
        this._display({ config, shrome })
      })
      .catch(console.error)
  }

  _attach() {
    this._source.on('change', this._onSource)
    this._config.on('theme' , this._onTheme )
  }

  _onSource({ detail: { local, user, repo, url } }) {
    let shromeFilePromise
    let config = { ...this.__config, local, user, repo, url }

    if (local) {
      shromeFilePromise = new Promise((resolve, reject) =>
        Request.get(Request.makeUrl(url, '.shrome.json'))
          .then(data => resolve({ data, sha: Config.default.sha }))
          .catch(reject)
      )
    } else {
      if (!user || !repo) return this._display({
        config,
        error: !user && !repo
          ? 'Please fill user and repo fields'
          : !user
            ? 'Please fill user field'
            : 'Please fill repo field'
      })

      shromeFilePromise = Request.getShromeFile(user, repo)
    }

    shromeFilePromise
      .then(({ data, sha }) => {
        config = { ...config, sha, theme: Config.default.theme }
        data   = JSON.parse(data)
        const shrome = new Shrome({ data })

        this._display({ config, shrome })
        chrome.runtime.sendMessage({ reload: true })

        this._saveConfig(config)
        shrome.save()
      })
      .catch((error) => {
        this._display({ config, error })
      })

    return this
  }

  _onTheme({ detail: { theme } }) {
    chrome.runtime.sendMessage({ reload: true })

    this._saveConfig({ theme })

    return this
  }

  _display({ config, shrome = null, error = '' }) {
    const local = config.local
    const user  = config.user
    const repo  = config.repo
    const url   = config.url
    const theme = config.theme
    const data  = shrome ? shrome.data : null

    this._source.render({ local, user, repo, url, error })
    this._config.render({ data, theme })
  }

  _saveConfig(config) {
    this.__config = { ...this.__config, ...config }

    return Config.save(this.__config)
      .catch(console.error)
  }
}
