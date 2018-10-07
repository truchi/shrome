import Repo  from './Repo.js'

export default class User {
  constructor({ favorites = [], locals = [], repo = null }) {
    Object.assign(this, { favorites, locals, repo, tabs: {} })
  }

  tab(id, url = '') {
    if (!url) {
      delete this.tabs[id]
      return []
    }

    const { subthemeIds, regexpIds, files } = this.repo.theme.url(url)
    if (!subthemeIds.length) return []

    const fileIds = files.map(file => file.id)
    this.tabs[id] = { url, subthemeIds, regexpIds, fileIds }

    return files
  }

  viewData() {
    const data = this.repo.theme.clone()

    const markNode = (tabId, url) => nodeId => {
      const node = data.refs[nodeId]
      node.tabs || (node.tabs = {})

      node.tabs[tabId] = { url }
    }

    Object.entries(this.tabs)
      .forEach(([ tabId, { url, subthemeIds, regexpIds, fileIds } ]) =>
        subthemeIds.concat(regexpIds).concat(fileIds)
          .forEach(markNode(tabId, url))
      )

    return data.root
  }

  serialize() {
    const { favorites, locals } = this
    const repo = this.repo.intermediate()

    return JSON.stringify({ favorites, locals, repo })
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

  static parse(json) {
    let { favorites, locals, repo } = JSON.parse(json)
    repo = Repo.from(repo)

    return new User({ favorites, locals, repo })
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
