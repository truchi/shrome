export default class Config {
  static get default() {
    return {
      local: true,
      user : 'truchi',
      repo : 'shrome-themes',
      url  : 'http://localhost:8080/',
      sha  : null,
      theme: null
    }
  }

  static save(cfg) {
    const keys   = Object.keys(Config.default)
    const config = Object.keys(cfg)
      .filter(key => keys.includes(key))
      .reduce((carry, key) => { return { ...carry, [key]: cfg[key] } }, {})

    return new Promise((resolve, reject) =>
      chrome.storage.sync.set(config, () =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve()
      )
    )
  }

  static get() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get(Object.keys(Config.default), (config) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve({ ...Config.default, ...config })
      )
    )
  }
}
