import Helpers from '../Helpers.js'

export default class Shrome {
  constructor(shrome = {}, sanitize = false) {
    this
      .set({
        source: {
          mode: '',
          local: {
            url: ''
          },
          github: {
            url : '',
            user: '',
            repo: ''
          }
        },
        config: {
          theme : '',
          themes: {}
        }
      })
      .set(shrome, sanitize)
  }

  get url() {
    const mode = this.source.mode

    return this.source.hasOwnProperty(mode)
      ? this.source[mode].url
      : null
  }

  set url(url) {
    const mode = this.source.mode

    this.source.hasOwnProperty(mode) && (this.source[this.source.mode].url = url)
  }

  set(o, sanitize = false) {
    const url = o.url
    delete o.url

    Helpers.merge(this, o)
    url && (this.url = url)

    sanitize && o.config && o.config.themes && this._sanitize()

    return this
  }

  do(cb) {
    cb.bind(this)(this)

    return this
  }

  _sanitize() {
    // FIXME view broken TODO redo view
    Helpers.mapTree(this.config.themes, (theme, data, i, d, { path, key }) => {
      if (theme.startsWith('__')) return

      const cleanFiles = (file) => file.type
      const  makeFiles = (url, key) => (file, index) => {
        let ret = {
          priority: 0,
          type: ''
        }

        if (typeof file === 'string') {
          ret.name = file
        } else if (Helpers.isObject(file)) {
          file.hasOwnProperty('name'    ) && (ret.name     = file.name    )
          file.hasOwnProperty('priority') && (ret.priority = file.priority)
        }

        if      (ret.name.endsWith('.js' )) ret.type = 'js'
        else if (ret.name.endsWith('.css')) ret.type = 'css'

        ret.url = this.url + url + ret.name
        ret.key = key + '.' + index // NOTE theme MUST NOT be a number
        delete ret.name

        return ret
      }

      const matches = Helpers.arrayify(data.__matches)
            path   += data.__path || ''
            key    += (d !== 0 ? '.' : '') + theme // NOTE theme MUST NOT contain the dot character
      const files   = Helpers.arrayify(data.__files)
        .map(makeFiles(path.replace(/^\/+/, ''), key))
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
    let ret = {}
    if (!this.config.theme) return { matches, files }

    const theme = this.config.themes[this.config.theme]

    Helpers.mapTree(theme, (theme, data) => {
      if (theme.startsWith('__')) return true

      const _matches = data.__matches
      const index    = _matches.length
        ? _matches.findIndex(match => Shrome._getRegExp(match).test(url))
        : null

      if (index === -1) return false

      ret[data.__key + (index !== null ? '.' + index : '')] = data.__files
      matches[data.__key] = index
      files.push(data.__files)
    })

    files = JSON.parse(JSON.stringify(Helpers.flat(files)))

    ret = Helpers.flat(
      Object.entries(JSON.parse(JSON.stringify(ret)))
        .map(([ match, files ]) => files.map(file => (file.match = match) && file))
    )

    return ret
    return { matches, files }
  }

  save() {
    const shrome = JSON.stringify(this)

    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ shrome }, () =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve.bind(this)(this)
      )
    )
  }

  static get() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('shrome', ({ shrome }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(new Shrome(shrome ? JSON.parse(shrome) : {}))
      )
    )
  }

  static _getRegExp(string) {
    const pos     = string.lastIndexOf('/')
    const pattern = string.slice(1, pos)
    const flags   = string.slice(pos + 1, string.length)

    return new RegExp(pattern, flags)
  }
}
