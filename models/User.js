export default class User {
  constructor({ favorites = [], locals = [], repo = null }) {
    Object.assign(this, { favorites, locals, repo, tabs: {} })
  }

  tab(id, url = '') {
    if (!url) {
      delete this.tabs[id]
      return []
    }

    const { subthemesIds, regexpsIds, files } = this.repo.theme.url(url)
    if (!subthemesIds.length) return []

    const filesIds = files.map(file => file.id)
    this.tabs[id]  = { subthemesIds, regexpsIds, filesIds }

    return files
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
    // TODO user.repo.theme._refs??? user.tabs???
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('user', ({ user }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(User.parse(user))
      )
    )
  }
}
