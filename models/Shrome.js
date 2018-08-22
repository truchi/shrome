import Helpers from '../Helpers.js'

export default class Shrome {
  constructor({ data }) {
    this.data = data

    this.sanitized = JSON.parse(JSON.stringify(this.data))

    Helpers.mapTree(this.sanitized, (theme, data, i, d, { base, key }) => {
      if (theme.startsWith('__')) return

      const makeArr  = obj => obj ? (Array.isArray(obj) ? obj : [ obj ]) : []
      const makeFile = (base, key, type) => (file, index) => ({ key, type, index, file: base + file })

      const match = makeArr(data.__match).map(match => Shrome.getRegExp(match))
            base += data.__base || ''
            key  += (d !== 0 ? '.' : '') + theme // NOTE theme shouldn't contain '.' ...
      const js    = makeArr(data.__js ).map(makeFile(base, key, 'js' ))
      const css   = makeArr(data.__css).map(makeFile(base, key, 'css'))
      const files = js.concat(css)

      data.__match = match
      data.__files = files

      delete data.__base
      delete data.__js
      delete data.__css

      return { base, key }
    }, { base: '', key: '' })
  }

  files(url, theme) {
    let files = []
    if (!theme) return files

    const data = this.sanitized[theme]

    Helpers.mapTree(data, (theme, data) => {
      if (theme.startsWith('__'))                       return true
      if (!data.__match.length)                         return true // FIXME wrong, should add files!!
      if (!data.__match.some(match => match.test(url))) return false

      files.push(data.__files)

      return true
    })

    return JSON.parse(JSON.stringify([].concat.apply([], files)))
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
          : resolve(new Shrome({ data: data ? JSON.parse(data) : {} }))
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
