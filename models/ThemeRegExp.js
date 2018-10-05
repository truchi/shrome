import Helpers from '../Helpers.js'

export default class ThemeRegExp {
  constructor(themeId, index, regexp) {
    let pattern = ''
    let flags   = ''

    if (regexp.startsWith('/')) {
      const pos = regexp.lastIndexOf('/')
      pattern   = regexp.slice(1, pos)
      flags     = regexp.slice(pos + 1, regexp.length)
    } else {
      pattern = Helpers.regexpify(regexp)
    }

    this.themeId = themeId
    this.index   = index
    this.regexp  = new RegExp(pattern, flags)
  }

  test(string) {
    return this.regexp.test(string)
  }

  static make(themeId, regexps) {
    return Helpers.arrayify(regexps).map((regexp, index) => new ThemeRegExp(themeId, index, regexp))
  }
}
