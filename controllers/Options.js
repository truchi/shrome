import Shrome  from '../models/Shrome.js'
import Request from './Request.js'

export default class Options {
  constructor({ source, config }) {
    this._source = source
    this._config = config
    this._shrome = null

    this._onSource = this._onSource.bind(this)
    this._onTheme  = this._onTheme .bind(this)

    this._init()
  }

  _init() {
    return Shrome.get()
      .then(shrome => (this._shrome = shrome) && this._attach()._display())
      .catch(console.error)
  }

  _attach() {
    this._source.on('change', this._onSource)
    this._config.on('theme' , this._onTheme )

    return this
  }

  _onSource({ detail: { mode, user, repo, url } }) {
    let shromeFilePromise
    this._shrome.set({ mode, user, repo, localUrl: url })

    const request = new Request({
      mode: this._shrome.mode,
      url : this._shrome.localUrl ,
      user: this._shrome.user,
      repo: this._shrome.repo
    })

    if (mode === 'github') {
      if (!user || !repo) return this._display(
        !user && !repo
          ? 'Please fill user and repo fields'
          : !user
            ? 'Please fill user field'
            : 'Please fill repo field'
      )
    }

    request.themes()
      .then(({ themes, url }) =>
        this._shrome
          .set({ url, theme: '', themes }, true)
          .save()
          .then(() => chrome.runtime.sendMessage({ reload: true }) || this._display())
      )
      .catch((error) => this._display(error))

    return this
  }

  _onTheme({ detail: { theme } }) {
    chrome.runtime.sendMessage({ reload: true })

    this._shrome
      .set({ theme })
      .save()

    return this
  }

  _display(error = '') {
    this._source.render({ ...this._shrome, error })
    this._config.render(this._shrome)

    return this
  }
}
