import BaseRequest from './BaseRequest.js'

export default class Github extends BaseRequest {
  constructor({ user, repo}) {
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
      this.file(`https://api.github.com/repos/${ user }/${ repo }/commits`)
        .then((commits) => (commits = JSON.parse(commits)) ||
          commits.length
            ? resolve(`https://rawgit.com/${ user }/${ repo }/${ commits[0].sha }/`)
            : reject(`${ user }/${ repo } has no commits`)
        )
        .catch(() => reject(`Invalid user/repo: ${ this._user }/${ this._repo }`))
    )
  }
}
