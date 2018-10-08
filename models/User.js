import Repo     from './Repo.js'
import Request  from '../controllers/Request.js'

export default class User {
  constructor({ favorites = [], locals = [], repo = null, _tabs = {}, _errors = {} }) {
    Object.assign(this, { favorites, locals, repo, _tabs, _errors })
  }

  get(tabId, url = '') {
    return new Promise((resolve, reject) =>
      Request.files(this._tab(tabId, url))
        .then(files => this._err(files) && resolve(files))
        .catch(reject)
    )
  }

  _tab(id, url = '') {
    if (!url) {
      delete this._tabs[id]
      return []
    }

    const { subthemeIds, regexpIds, files } = this.repo.theme.url(url)
    if (!subthemeIds.length) return []

    const fileIds = files.map(file => file.id)
    this._tabs[id] = { url, subthemeIds, regexpIds, fileIds }

    return files
  }

  _err(files = []) {
    files.forEach(file => file.error && (this._errors[file.id] = file.error))

    return this
  }

  discover() {
    return Request.discover()
  }

  treeData() {
    if (!this.repo) return

    const data = this.repo.theme.clone()

    Object.entries(this._tabs)
      .forEach(([ tabId, { url, subthemeIds, regexpIds, fileIds } ]) =>
        subthemeIds.concat(regexpIds).concat(fileIds)
          .forEach(nodeId => {
            const node = data.refs[nodeId]
            node.tabs || (node.tabs = {})

            node.tabs[tabId] = { url }
          })
      )

    Object.entries(this._errors)
      .forEach(([ id, error ]) => data.refs[id].error = error)

    return data.root
  }

  intermediate() {
    const { favorites, locals, _tabs, _errors } = this
    const repo = this.repo ? this.repo.intermediate() : null

    return { favorites, locals, repo, _tabs, _errors }
  }

  save() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ user: this.intermediate() }, () =>
        chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve.bind(user)(user)
      )
    )
  }

  static from(intermediate) {
    let user

    try {
      let { favorites, locals, repo, _tabs, _errors } = intermediate
      repo = Repo.from(repo)
      user = new User({ favorites, locals, repo, _tabs, _errors })
    } catch (e) {
      user = new User({})
    }

    return user
  }

  static load() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('user', ({ user }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(User.from(user))
      )
    )
  }
}
