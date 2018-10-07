import Helpers from '../Helpers.js'
import Local   from './providers/Local.js'
import Github  from './providers/Github.js'
import Repo    from '../models/Repo.js'
import Theme   from '../models/Theme.js'

export default class Request {
  static discover() {
    return Promise.all(
      Object.values(Request.providers)
        .map(provider =>
          provider.discover()
            .then(repos => repos.map(repo => new Repo(repo)))
        )
    ).then(repos => Helpers.flat(repos))
  }

  static repo(repo) {
    const provider = Request.providers[repo.provider]

    return provider.repo(repo)
      .then(repo => new Repo(repo))
  }

  static theme(repo) {
    const provider = Request.providers[repo.provider]

    return provider.theme(repo)
      .then(theme => new Theme(Theme.sanitize(JSON.parse(theme))))
  }

  static files(repo, files = []) {
    const provider = Request.providers[repo.provider]
    files          = Helpers.arrayify(files)

    return Promise.all(
      files.map(file =>
        Helpers.ajax(provider.fileUrl(repo, file))
          .then (content => (file.content = content) && file)
          .catch(error   => (file.error   = error  ) && file)
      )
    )
  }

  static get providers() {
    return {
      local : Local,
      github: Github
    }
  }
}
