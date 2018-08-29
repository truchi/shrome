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
      this.getUrl(user, repo)
        .then(url =>
          this.get(file = Github.fileUrl(user, repo, sha, '.shrome.json'))
            .then (themes => resolve({ themes, url }))
            .catch(error  => reject(`${ file }: ${ error }`))
        )
        .catch(reject)
    )
  }

  getFile(file) {
    return this.get(Github.fileUrl(this._user, this._repo, file))
  }

  getUrl(user, repo) {
    return new Promise((resolve, reject) =>
      this.get(Github.commitsUrl(user, repo))
        .then((commits) => (commits = JSON.parse(commits)) ||
          commits.length
            ? resolve(`https://rawgit.com/${ user }/${ repo }/${ commits[0].sha }`)
            : reject(`${ user }/${ repo } has no commits`)
        )
        .catch(() => reject(`Invalid user/repo: ${ this._user }/${ this._repo }`))
    )
  }

  static commitsUrl(user, repo) {
    return `https://api.github.com/repos/${ user }/${ repo }/commits`
  }

  static fileUrl(user, repo, sha, file) {
    return BaseRequest.url(`https://rawgit.com/${ user }/${ repo }/${ sha }`, file)
  }
}
