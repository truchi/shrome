import Helpers from '../Helpers.js'

export default class ThemeRegExp {
  constructor({ id, parentId, regexp, on = false }) {
    Object.assign(this, { id, parentId, regexp, on })
  }

  test(string) {
    return this.regexp.test(string)
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
}
