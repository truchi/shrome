import Local  from './Local.js'
import Github from './Github.js'

export default class Request {
  constructor({ mode, url, user, repo }) {
    this._request = mode === 'local'
      ? new Local ({ url })
      : new Github({ user, repo })
  }

  themes() {
    return new Promise((resolve, reject) =>
      this._request.themes()
        .then(({ themes, url }) => {
          try {
            themes = JSON.parse(themes)
            resolve({ themes, url })
          } catch (e) {
            reject('Cannot parse themes', themes, e)
          }
        })
        .catch(reject)
    )
  }

  file(url) {
    return this._request.file(url)
  }
}
