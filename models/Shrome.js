// requires 'helpers.js'

class Shrome {
  constructor({ data }) {
    this.data = data

    this.sanitized = JSON.parse(JSON.stringify(this.data))

    Helpers.mapTree(this.sanitized.themes, (theme, data, i, d, base) => {
      if (theme.startsWith('__')) return

      const makeArr = obj => obj ? (Array.isArray(obj) ? obj : [ obj ]) : []
      data.__match  = makeArr(data.__match).map(match => Shrome.getRegExp(match))
      data.__js     = makeArr(data.__js)
      data.__css    = makeArr(data.__css)
      data.__base   = (base || '') + (data.__base || '')

      return data.__base
    })
  }

  files(url, theme) {
    if (!theme) return []

    const data  = this.sanitized.themes[theme]
    let   files = { js: [], css: [] }

    Helpers.mapTree(data, (theme, data) => {
      if (theme.startsWith('__'))                       return true
      if (!data.__match.length)                         return true
      if (!data.__match.some(match => match.test(url))) return false

      data.__js .forEach(js  => files.js .push(`${ data.__base }/${ js  }`))
      data.__css.forEach(css => files.css.push(`${ data.__base }/${ css }`))

      return true
    })

    return files
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
          : resolve(new Shrome({ data: data ? JSON.parse(data) : Shrome.default }))
      )
    )
  }

  static getRegExp(string) {
    const pos     = string.lastIndexOf('/')
    const pattern = string.slice(1, pos)
    const flags   = string.slice(pos + 1, string.length)

    return new RegExp(pattern, flags)
  }
}

Shrome.default = {
  themes: {}
}

window.Shrome = Shrome
