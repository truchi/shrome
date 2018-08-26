import Shrome from '../models/Shrome.js'
import Local  from './Local.js'
import Github from './Github.js'

export default class Request {
  constructor({ local, user, repo, url, sha }) {
    this._request = local
      ? new Local ({ url })
      : new Github({ user, repo, sha })
  }

  getConfig() {
    return new Promise((resolve, reject) =>
      this._request.getConfig()
        .then(({ config, sha = Shrome.default.sha }) => {
          try {
            config = JSON.parse(config)
            resolve({ config, sha })
          } catch (e) {
            reject(`Cannot parse: ${ config }`)
          }
        })
        .catch(reject)
    )
  }

  getFile(file) {
    return this._request.getFile(file)
  }
}
