import Helpers from '../../Helpers.js'

export default class Local {
  static discover() {
    return new Promise(resolve => resolve([]))
  }

  static repo(repo) {
    if (!repo.url) throw 'Repo has no URL'

    return new Promise(resolve => resolve(
      Object.assign({}, repo, { head: { url: repo.url } })
    ))
  }

  static theme(repo) {
    return Helpers.ajax(Local.fileUrl(repo, { path: '.shrome.json' }))
  }

  static fileUrl(repo, file) {
    const base = Helpers.trim(repo.url , '/')
    const path = Helpers.trim(file.path, '/')

    return base + '/' + path
  }
}
