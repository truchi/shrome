import Helpers from '../Helpers.js'

export default class Shrome {
  constructor(shrome) {
    this.set(shrome)
  }

  set(o, fromUser = false) {
    const isDefined = (o  ) => typeof o !== 'undefined'
    const set       = (key) => this[key] = o[key]

    Object.keys(Shrome.default)
      .map(key => isDefined(o[key]) && set(key))

    fromUser && o.config && this._sanitize()

    return this
  }

  _sanitize() {
    // FIXME view broken TODO redo view
    Helpers.mapTree(this.config, (theme, data, i, d, { path, key }) => {
      if (theme.startsWith('__')) return

      const cleanFiles = (file) => file.type
      const  makeFiles = (url, key) => (file, index) => {
        let ret = {
          name: '',
          priority: 0,
          type: '',
          url,
          key
        }

        if (typeof file === 'string') {
          ret.name = file
        } else if (Helpers.isObject(file)) {
          file.hasOwnProperty('name'    ) && (ret.name     = file.name    )
          file.hasOwnProperty('priority') && (ret.priority = file.priority)
        }

        if      (ret.name.endsWith('.js' )) ret.type = 'js'
        else if (ret.name.endsWith('.css')) ret.type = 'css'

        ret.url += ret.name
        ret.key += '.' + index // NOTE theme MUST NOT be a number
        delete ret.name

        return ret
      }

      const matches = Helpers.arrayify(data.__matches)
            path   += data.__path || ''
            key    += (d !== 0 ? '.' : '') + theme // NOTE theme MUST NOT contain the dot character
      const files   = Helpers.arrayify(data.__files)
        .map(makeFiles(path, key))
        .filter(cleanFiles)

      data.__key     = key
      data.__matches = matches
      data.__files   = files

      delete data.__path

      return { path, key }
    }, { path: '', key: '' })

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
