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

  set(id, on) {
    const set = id => this.refs[id].on = on

    this._childIds(id)
      .concat(on ? this._parentIds(id) : [])
      .forEach(id => set(id))

    return set(id)
  }

  url(url) {
    let ret = function get(subtheme, ret) {
      const on      = subtheme.on
      const regexps = subtheme.regexps
      const empty   = !regexps.length
      const index   = regexps.findIndex(regexp => regexp.test(url))

      if (on && (empty || index !== -1)) {
        ret.subthemeIds.push(subtheme.id)
        ;(index !== -1) && ret.regexpIds.push(regexps[index].id)
        subtheme.files   .forEach(file  => ret.files.push(file.clone()))
        subtheme.children.forEach(child => get(child, ret))
      }

      return ret
    }(this.root, { subthemeIds: [], regexpIds: [], files: [] })

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

  _parentIds(id) {
    const refs = this.refs

    return function get(id, ids = []) {
      const parentId = refs[id].parentId

      if (parentId) ids.push(parentId) && get(parentId, ids)

      return ids
    }(id)
  }

  _childIds(id) {
    const refs = this.refs

    return function get(id, ids = []) {
      const node = refs[id]

      ;(node.children || [])
        .concat(node.regexps || [])
        .concat(node.files   || [])
        .forEach(node => ids.push(node.id) && get(node.id, ids))

      return ids
    }(id)
  }

  static sanitize(data, url) {
    let   inc   = 0
    const getId = () => ++inc

    const root = function sanitize(data, prepend, parentId = 0, name = '') {
      prepend += data.__path || ''

      const id = getId()
      const { regexps, files, childrenData } = SubTheme.sanitize(data, prepend, id, getId)
      const children = childrenData.map(([ name, data ]) => sanitize(data, prepend, id, name))

      return new SubTheme({ id, parentId, name, regexps, files, children })
    }(data, url)

    return { root }
  }

  static from(intermediate, clone = false) {
    let { root } = intermediate
    root = clone ? root.clone() : SubTheme.from(root)

    return new Theme({ root })
  }
}
