class Shrome {
  constructor({ data }) {
    this.data = data
  }

  save() {
    const data = JSON.stringify(this.data)

    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ data }, () =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve()
      )
    )
  }

  static get() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('data', ({ data }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(new Shrome({ data: data ? JSON.parse(data) : undefined }))
      )
    )
  }
}

window.Shrome = Shrome
