import Helpers from '../../Helpers.js'

export default class Local {
  static discover() {
    return new Promise(resolve => resolve([]))
  }

  static repo(repo) {
    if (!repo.url) throw 'Repo has no URL'

    return new Promise(resolve => resolve(
      Object.assign({}, repo, { provider: 'local', head: { url: repo.url } })
    ))
  }

  static fileUrl(repo, file = '') {
    const base = Helpers.trim(repo.url , '/')
    if (!file) return base

    const path = Helpers.trim(file.path, '/')
    return base + '/' + path
  }
}
