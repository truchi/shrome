import Helpers     from '../Helpers.js'
import ThemeFile   from './ThemeFile.js'
import ThemeRegExp from './ThemeRegExp.js'

export default class Theme {
  constructor(data = {}) {
    this._data = data
    this._refs = {}
    this.theme = this._sanitize(this._data)
    console.log(this)
  }

  on(id) {
    const theme    = this._refs[id]
    const parentId = theme.parentId

    theme.on = true
    if (parentId) this.on(parentId)

    return this
  }

  off(id) {
    const theme = this._refs[id]

    theme.on = false
    theme.children.forEach(child => this.off(child.id))

    return this
  }

  files(url) {
    let files = function get(theme, ret) {
      const on    =  theme.on
      const empty = !theme.regexps.length
      const some  =  theme.regexps.some(regexp => regexp.test(url))

      if (on && (empty || some)) {
        theme.files   .forEach(file  => ret.push(file) )
        theme.children.forEach(child => get(child, ret))
      }

      return ret
    }(this.theme, [])

    return ThemeFile.sort(files)
  }

  _sanitize(data) {
    let inc = 0

    const sanitize = (data, parentId = 0, name = '', path = '') => {
      ++inc
      path = path + (data.__path || '')

      const id       = inc
      const on       = false
      const regexps  = ThemeRegExp.make(data.__regexpes)
      const files    = ThemeFile  .make(data.__files, path)
      const children = Object.entries(data)
        .map(([ name, data ]) => !name.startsWith('__') ? sanitize(data, id, name, path) : null)
        .filter(o => o)

      this._refs[id] = { id, parentId, name, regexps, files, children, on }

      return this._refs[id]
    }

    return sanitize(data)
  }
}
