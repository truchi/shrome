class Shrome {
  constructor(user, repo, data) {
    this.user = user
    this.repo = repo
    this.data = data
  }

  save() {
    const user = this.user
    const repo = this.repo
    const data = JSON.stringify(this.data)

    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ user, repo, data }, () =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve()
      )
    )
  }

  static get() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get([ 'user', 'repo', 'data' ], ({ user, repo, data }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(new Shrome(user, repo, data ? JSON.parse(data) : undefined ))
      )
    )
  }
}

window.Shrome = Shrome
