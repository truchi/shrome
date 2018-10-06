import Helpers     from '../Helpers.js'
import SubTheme    from './SubTheme.js'
import ThemeFile   from './ThemeFile.js'
import ThemeRegExp from './ThemeRegExp.js'

export default class Theme {
  constructor({ root = {} }) {
    Object.assign(this, { root })

    this.refs = {}
    this._makeRefs(this.root)
  }

  on(ids = []) {
    const on = id => {
      const node = this.refs[id]
      node && (node.on = true)
    }

    Helpers.arrayify(ids).map(on)

    return this
  }

  off(ids = []) {
    const off = id => {
      const node = this.refs[id]
      node && (node.on = false)
    }

    Helpers.arrayify(ids).map(off)

    return this
  }

  url(url) {
    let ret = function get(subtheme, ret) {
      const on      = subtheme.on
      const regexps = subtheme.regexps
      const empty   = !regexps.length
      const index   = regexps.findIndex(regexp => regexp.test(url))

      if (on && (empty || index !== -1)) {
        ret.subthemesIds.push(subtheme.id)
        ;(index !== -1) && ret.regexpsIds.push(regexps[index].id)
        subtheme.files   .forEach(file  => ret.files.push(file.clone()))
        subtheme.children.forEach(child => get(child, ret))
      }

      return ret
    }(this.root, { subthemesIds: [], regexpsIds: [], files: [] })

    ret.files = ThemeFile.sort(ret.files)

    return ret
  }

  clone() {
    return Theme.from(this, true)
  }

  intermediate() {
    const root = this.root.intermediate()

    return { root }
  }

  _makeRefs(node) {
    this.refs[node.id] = node

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

  static from(intermediate, clone = false) {
    let { root } = intermediate
    root = clone ? root.clone() : SubTheme.from(root)

    return new Theme({ root })
  }
}
