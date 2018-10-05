import Helpers     from '../Helpers.js'
import ThemeFile   from './ThemeFile.js'
import ThemeRegExp from './ThemeRegExp.js'

export default class SubTheme {
  constructor({ id, parentId, name, regexps, files, children, on = false }) {
    Object.assign(this, { id, parentId, name, regexps, files, children, on })
  }

  static sanitize(getId, data, id, prepend) {
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
}
