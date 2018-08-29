import Helpers from '../Helpers.js'

export default class Shrome {
  constructor(shrome, sanitize = false) {
    Object.entries(JSON.parse(JSON.stringify(Shrome.default)))
      .forEach(([ key, value ]) => this[key] = value)

    this.set(shrome, sanitize)
  }

  get mode()         { return this.source.mode        }
  set mode(mode)     { this.source.mode = mode        }
  get localUrl()     { return this.source.local.url   }
  set localUrl(url)  { this.source.local.url = url    }
  get githubUrl()    { return this.source.github.url  }
  set githubUrl(url) { this.source.github.url = url   }
  get user()         { return this.source.github.user }
  set user(user)     { this.source.github.user = user }
  get repo()         { return this.source.github.repo }
  set repo(repo)     { this.source.github.repo = repo }
  get theme()        { return this.config.theme       }
  set theme(theme)   { this.config.theme = theme      }
  get themes()       { return this.config.themes      }
  set themes(themes) { this.config.themes = themes    }
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
    const keys = ['mode', 'localUrl', 'githubUrl', 'user', 'repo', 'theme', 'themes', 'url']

    Object.entries(o)
      .forEach(([ key, value ]) => keys.includes(key) && (this[key] = value))

    sanitize && o.themes && this._sanitize()

    return this
  }

  _sanitize() {
    // FIXME view broken TODO redo view
    Helpers.mapTree(this.themes, (theme, data, i, d, { path, key }) => {
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
    }, { path: this.url || '', key: '' })

    return this
  }

  files(url) {
    let files   = []
    let matches = {}
    if (!this.theme) return { matches, files }

    const data = this.themes[this.theme]

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
    }
  }

  static _getRegExp(string) {
    const pos     = string.lastIndexOf('/')
    const pattern = string.slice(1, pos)
    const flags   = string.slice(pos + 1, string.length)

    return new RegExp(pattern, flags)
  }
}
