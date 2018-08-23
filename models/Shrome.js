import Helpers from '../Helpers.js'

export default class Shrome {
  constructor(shrome) {
    this.set(shrome)
  }

  set(o) {
    const isDefined = (o  ) => typeof o !== 'undefined'
    const set       = (key) => this[key] = o[key]

    Object.keys(Shrome.default)
      .map(key => isDefined(o[key]) && set(key))

    o.config && this._sanitize()

    return this
  }

  _sanitize() {
    if (this.config.__sanitized) return this

    // FIXME view broken TODO redo view
    Helpers.mapTree(this.config, (theme, data, i, d, { base, key }) => {
      if (theme.startsWith('__')) return

      const makeArr  = obj => obj ? (Array.isArray(obj) ? obj : [ obj ]) : []
      const makeFile = (base, key, type) => (file, index) => ({ key, type, index, file: base + file })

      const match = makeArr(data.__match)
            base += data.__base || ''
            key  += (d !== 0 ? '.' : '') + theme // NOTE theme shouldn't contain '.' ...
      const js    = makeArr(data.__js ).map(makeFile(base, key, 'js' ))
      const css   = makeArr(data.__css).map(makeFile(base, key, 'css'))
      const files = js.concat(css) // TODO group by type for content script, redo content script as before

      data.__key   = key
      data.__match = match
      data.__files = files

      delete data.__base
      delete data.__js
      delete data.__css

      return { base, key }
    }, { base: this.url, key: '' }) // FIXME doesnt work for github TODO redo request

    this.config.__sanitized = true // NOTE user must not write this into his .shrome.json

    return this
  }

  files(url) {
    let files   = []
    let matches = {}
    if (!this.theme) return { matches, files }

    const data = this.config[this.theme]

    Helpers.mapTree(data, (theme, data) => {
      if (theme.startsWith('__')) return true

      const match = data.__match
      const index = match.length
        ? match.findIndex(match => Shrome._getRegExp(match).test(url))
        : null

      if (index === -1) return false

      matches[data.__key] = index
      files.push(data.__files)
    })

    files = JSON.parse(JSON.stringify([].concat.apply([], files)))

    return { matches, files }
  }

  save() {
    const shrome = JSON.stringify(this)

    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ shrome }, () =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve()
      )
    )
  }

  static get() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('shrome', ({ shrome }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(new Shrome(shrome ? JSON.parse(shrome) : Shrome.default))
      )
    )
  }

  static get default() {
    return {
      local : true,
      user  : 'truchi',
      repo  : 'shrome-themes',
      url   : 'http://localhost:8080/',
      sha   : null,
      theme : null,
      config: {}
    }
  }

  static _getRegExp(string) {
    const pos     = string.lastIndexOf('/')
    const pattern = string.slice(1, pos)
    const flags   = string.slice(pos + 1, string.length)

    return new RegExp(pattern, flags)
  }
}
