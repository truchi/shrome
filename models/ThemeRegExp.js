import Helpers from '../Helpers.js'

export default class ThemeRegExp {
  constructor({ id, parentId, regexp, on = true }) {
    Object.assign(this, { id, parentId, regexp, on })
  }

  test(string) {
    return this.regexp.test(string)
  }

  clone() {
    return ThemeRegExp.from(this)
  }

  intermediate() {
    const { id, parentId, on } = this
    const { source, flags    } = this.regexp

    return { id, parentId, regexp: { source, flags }, on }
  }

  static sanitize(regexp) {
    let pattern = ''
    let flags   = ''

    if (regexp.startsWith('/')) {
      const pos = regexp.lastIndexOf('/')
      pattern   = regexp.slice(1, pos)
      flags     = regexp.slice(pos + 1, regexp.length)
    } else {
      pattern = Helpers.regexpify(regexp)
    }

    return { regexp: new RegExp(pattern, flags) }
  }

  static sort(regexps) {
    return regexps
  }

  static from(intermediate) {
    let { id, parentId, regexp, on } = intermediate
    regexp = new RegExp(regexp.source, regexp.flags)

    return new ThemeRegExp({ id, parentId, regexp, on })
  }
}
