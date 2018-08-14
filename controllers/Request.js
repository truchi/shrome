class Request {
  static getShromeFile(user, repo) {
    return new Promise((resolve, reject) =>
      Request.getLastCommitSha(user, repo)
        .catch(reject)
        .then(sha =>
          this.get(Request.githubFileUrl(user, repo, sha, '.shrome.json'))
            .then (data => resolve({ user, repo, sha, data }))
            .catch(()   => reject (`${ user }/${ repo }/${ sha }/.shrome.json not found`))
        )
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

      xhr.onreadystatechange = (event) => {
        const that = event.target

        if (that.readyState === XMLHttpRequest.DONE) {
          if (that.status === 200) resolve(that.responseText)
          else                     reject (that.statusText  )
        }
      }

      xhr.open('GET', url, true)

      try {
        xhr.send()
      } catch (error) {
        reject(error)
      }
    })
  }

  static githubFileUrl(user, repo, sha, file) {
    file = file.replace(/^\/+/, '')

    return `https://rawgit.com/${ user }/${ repo }/${ sha }/${ file }`
  }

  static commitsApiUrl(user, repo) {
    return `https://api.github.com/repos/${ user }/${ repo }/commits`
  }
}

window.Request = Request
