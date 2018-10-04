import Helpers from '../Helpers.js'

export default class ThemeRegExp {
  constructor(regexp) {
    let pattern = ''
    let flags   = ''

    if (regexp.startsWith('/')) {
      const pos = regexp.lastIndexOf('/')
      pattern   = regexp.slice(1, pos)
      flags     = regexp.slice(pos + 1, regexp.length)
    } else {
      pattern = Helpers.regexpify(regexp)
    }

    this.regexp = new RegExp(pattern, flags)
  }

  test(string) {
    return this.regexp.test(string)
  }

  static make(regexps) {
    return Helpers.arrayify(regexps).map(regexp => new ThemeRegExp(regexp))
  }
}
