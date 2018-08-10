class Config {
  static save(cfg) {
    const keys   = Object.keys(Config.default)
    const config = Object.keys(cfg)
      .map(key => keys.includes(key))
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

Config.default = {
  user : 'truchi',
  repo : 'shrome-themes',
  local: false,
  sha  : ''
}

window.Config = Config
