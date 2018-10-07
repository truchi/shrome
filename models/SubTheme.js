import Helpers     from '../Helpers.js'
import ThemeFile   from './ThemeFile.js'
import ThemeRegExp from './ThemeRegExp.js'

export default class SubTheme {
  constructor({ id, parentId, name, regexps, files, children, on = false }) {
    Object.assign(this, { id, parentId, name, regexps, files, children, on })
  }

  clone() {
    return SubTheme.from(this, true)
  }

  intermediate() {
    const { id, parentId, name, on } = this
    const regexps  = this.regexps .map(regexp => regexp.intermediate())
    const files    = this.files   .map(file   => file  .intermediate())
    const children = this.children.map(child  => child .intermediate())

    return { id, parentId, name, regexps, files, children, on }
  }

  static sanitize(data, prepend, id, getId) {
    const instanciate = (arr, ctor) =>
      ctor.sort(
        Helpers.arrayify(arr).map(elem => {
          elem          = ctor.sanitize(elem, prepend)
          elem.id       = getId()
          elem.parentId = id
          elem          = new ctor(elem)

          return elem
        })
      )

    const regexps      = instanciate(data.__matches, ThemeRegExp)
    const files        = instanciate(data.__files  , ThemeFile  )
    const childrenData = Object.entries(data)
      .filter(([ name, data ]) => !name.startsWith('__') )

    return { regexps, files, childrenData }
  }

  static from(intermediate, clone = false) {
    let { id, parentId, name, regexps, files, children, on } = intermediate
    regexps  = regexps .map(regexp => clone ? regexp.clone() : ThemeRegExp.from(regexp))
    files    = files   .map(file   => clone ? file  .clone() : ThemeFile  .from(file  ))
    children = children.map(child  => clone ? child .clone() : SubTheme   .from(child ))

    return new SubTheme({ id, parentId, name, regexps, files, children, on })
  }
}
