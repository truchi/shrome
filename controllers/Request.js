export default class Request {
  static getShromeFile(user, repo) {
    return new Promise((resolve, reject) =>
      Request.getLastCommitSha(user, repo)
        .then(sha =>
          this.get(Request.githubFileUrl(user, repo, sha, '.shrome.json'))
            .then (data => resolve({ data, sha }))
            .catch(()   => reject (`${ user }/${ repo }/${ sha }/.shrome.json not found`))
        )
        .catch(reject)
    )
  }

  static getLastCommitSha(user, repo) {
    return new Promise((resolve, reject) =>
      this.get(Request.commitsApiUrl(user, repo))
        .then ((commits) => resolve(JSON.parse(commits)[0].sha))
        .catch(()        => reject (`Invalid user/repo: ${ user }/${ repo }`))
    )
  }

  static get(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) resolve(xhr.responseText)
          else                    reject (xhr.status === 0
                                            ? 'Unknown error'
                                            : xhr.status + ' ' + xhr.statusText
                                         )
        }
      }

      xhr.open('GET', url, true)
      xhr.send()
    })
  }

  static makeUrl(url, file) {
    url  = url .replace(/\/+$/, '')
    file = file.replace(/^\/+/, '')

    return `${ url }/${ file }`
  }

  static githubFileUrl(user, repo, sha, file) {
    return Request.makeUrl(`https://rawgit.com/${ user }/${ repo }/${ sha }`, file)
  }

  static commitsApiUrl(user, repo) {
    return `https://api.github.com/repos/${ user }/${ repo }/commits`
  }
}
