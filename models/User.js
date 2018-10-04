export default class User {
  constructor(data = {}) {
    const defaults = {
      favorites: [],
      locals   : [],
      repo     : null
    }

    this.favorites = data.favorites || defaults.favorites
    this.locals    = data.locals    || defaults.locals
    this.repo      = data.current   || defaults.repo
  }

  serialize() {
    return JSON.stringify(this)
  }

  save() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ user: this.serialize() }, () =>
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve.bind(user)(user)
      )
    )
  }

  static parse(string) {
    return new User(JSON.parse(string))
  }

  static load() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('user', ({ user }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(User.parse(user))
      )
    )
  }
}
