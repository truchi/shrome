import Helpers     from '../Helpers.js'
import SubTheme    from './SubTheme.js'
import ThemeFile   from './ThemeFile.js'
import ThemeRegExp from './ThemeRegExp.js'

export default class Theme {
  constructor({ root }) {
    Object.assign(this, { root })

    this._refs = {}
    this._makeRefs(this.root)
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
        theme.files   .forEach(file  => ret.push(file.clone()))
        theme.children.forEach(child => get(child, ret))
      }

      return ret
    }(this.root, [])

    return ThemeFile.sort(files)
  }

  _makeRefs(node) {
    this._refs[node.id] = node

    ;(node.children || [])
      .concat(node.regexps || [])
      .concat(node.files   || [])
      .forEach(node => this._makeRefs(node))

    return this
  }

  static sanitize(data) {
    let inc = 0
    const getId = () => ++inc

    const root = function sanitize(data, parentId = 0, name = '', prepend = '') {
      prepend += data.__path || ''

      const id = getId()
      const { regexps, files, childrenData } = SubTheme.sanitize(getId, data, id, prepend)
      const children = childrenData.map(([ name, data ]) => sanitize(data, id, name, prepend))

      return new SubTheme({ id, parentId, name, regexps, files, children })
    }(data)

    return { root }
  }
}
