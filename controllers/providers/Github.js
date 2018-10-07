import Helpers from '../../Helpers.js'

export default class Github {
  static discover() {
    const ret = []

    return new Promise((resolve, reject) => {
      Helpers.ajax(`${ Github.apiUrl }/search/repositories?q=topic:shrome-themes`)
        .then((response) => {
          const repos = JSON.parse(response).items || []

          Promise.all(
            repos.map(repo => Github._repo(repo).then(ret.push.bind(ret)))
          )
            .then(() => resolve(ret))
            .catch(reject)
        })
        .catch(reject)
    })
  }

  static repo(repo) {
    return new Promise((resolve, reject) =>
      Helpers.ajax(`${ Github.apiUrl }/repos/${ repo.user.name }/${ repo.name }`)
        .then(repo => resolve(Github._repo(JSON.parse(repo))))
        .catch(reject)
    )
  }

  static _repo(repo) {
    return new Promise((resolve, reject) => {
      Helpers.ajax(`${ repo.url }/commits/${ repo.default_branch }`)
        .then(commit => {
          // TODO what if no commits?
          commit = JSON.parse(commit)

          resolve({
            name    : repo.name,
            desc    : repo.description || '',
            url     : repo.html_url,
            provider: 'github',
            head: {
              branch: repo.default_branch,
              sha   : commit.sha,
              url   : commit.html_url,
              date  : commit.commit.committer.date
            },
            user: {
              name: repo.owner.login,
              url : repo.owner.html_url,
              img : repo.owner.avatar_url
            }
          })
        })
        .catch(reject)
    })
  }

  static theme(repo) {
    // TODO empty repo? default branch !== master?
    return Helpers.ajax(Github.fileUrl(repo, { path: '.shrome.json' }))
  }

  static fileUrl(repo, file) {
    const user = repo.user.name
    const name = repo.name
    const sha  = repo.head.sha
    const path = Helpers.trim(file.path, '/')

    return `https://rawgit.com/${ user }/${ name }/${ sha }/${ path }`
  }

  static get apiUrl() {
    return 'https://api.github.com'
  }
}
