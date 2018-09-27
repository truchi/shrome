import BaseRequest from './BaseRequest.js'

export default class Github extends BaseRequest {
  constructor({ user, repo }) {
    super()

    this._user = user
    this._repo = repo
  }

  themes() {
    const user = this._user
    const repo = this._repo
    let   file

    return new Promise((resolve, reject) =>
      this._url(user, repo)
        .then(url =>
          this.file(file = url + '.shrome.json')
            .then (themes => resolve({ themes, url }))
            .catch(error  => reject(`${ file }: ${ error }`))
        )
        .catch(reject)
    )
  }

  _url(user, repo) {
    return new Promise((resolve, reject) =>
      this.file(`${ Github.apiUrl }/repos/${ user }/${ repo }/commits`)
        .then((commits) => (commits = JSON.parse(commits)) ||
          commits.length
            ? resolve(`https://rawgit.com/${ user }/${ repo }/${ commits[0].sha }/`)
            : reject(`${ user }/${ repo } has no commits`)
        )
        .catch(() => reject(`Invalid user/repo: ${ this._user }/${ this._repo }`))
    )
  }

  static discover() {
    return new Promise((resolve, reject) => {
      const ret = []
      const req = new BaseRequest()

      req.file(`${ Github.apiUrl }/search/repositories?q=topic:shrome-themes`)
        .then((response) => {
          let promises = []
          response = JSON.parse(response)

          response.items.forEach(repo => {
            const info = {
              name: repo.name,
              desc: repo.description || '',
              url : repo.html_url,
              head: {
                branch: repo.default_branch,
              },
              user: {
                name: repo.owner.login,
                url : repo.owner.html_url,
                img : repo.owner.avatar_url
              }
            }

            promises.push(
              new Promise((resolve, reject) => {
                req.file(`${ repo.url }/commits/${ info.head.branch }`)
                  .then(commit => {
                    commit = JSON.parse(commit)

                    info.head.sha  = commit.sha
                    info.head.url  = commit.html_url
                    info.head.date = commit.commit.committer.date

                    ret.push(info)
                    resolve()
                  })
                  .catch(reject)
              })
            )

            Promise.all(promises)
              .then(() => resolve(ret))
              .catch(reject)
          })
        })
        .catch(reject)
    })
  }

  static get apiUrl() {
    return 'https://api.github.com'
  }
}
