import BaseRequest from './BaseRequest.js'

export default class Github extends BaseRequest {
  constructor({ user, repo, sha }) {
    super()

    this._user = user
    this._repo = repo
    this._sha  = sha
  }

  getConfig() {
    const user = this._user
    const repo = this._repo
    let   url

    return new Promise((resolve, reject) =>
      this.getSha(user, repo)
        .then(sha =>
          (this._sha = sha) && this.get(url = Github.fileUrl(user, repo, sha, '.shrome.json'))
            .then (config => resolve({ config, sha }))
            .catch(error  => reject(`${ url }: ${ error }`))
        )
        .catch(reject)
    )
  }

  getFile(file) {
    return this.get(Github.fileUrl(this._user, this._repo, file))
  }

  getSha(user, repo) {
    return new Promise((resolve, reject) =>
      this.get(Github.commitsUrl(user, repo))
        .then((commits) => (commits = JSON.parse(commits)) ||
          commits.length
            ? resolve(commits[0].sha)
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
