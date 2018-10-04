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

  static parse(string) {
    return new User(JSON.parse(string))
  }

  static serialize(user) {
    return JSON.stringify(user)
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

  static save(user) {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ user: User.serialize(user) }, () =>
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve.bind(user)(user)
      )
    )
  }
}
