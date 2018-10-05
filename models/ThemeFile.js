import Helpers from '../Helpers.js'

export default class ThemeFile {
  constructor({ name, priority, type, path }) {
    this.name     = name
    this.priority = priority
    this.type     = type
    this.path     = path
  }

  clone() {
    const name     = this.name
    const priority = this.priority
    const type     = this.type
    const path     = this.path

    return new ThemeFile({ name, priority, type, path })
  }

  static from(file, path = '') {
    let name     = ''
    let priority = 0
    let type     = ''

    if (typeof file === 'string') {
      name = file
    } else if (Helpers.isObject(file)) {
      if (!file.hasOwnProperty('name')) throw 'File has no name'
      name     = file.name
      priority = file.priority || priority
    } else {
      throw 'File is neither string nor object'
    }

    if      (name.endsWith('.js' )) type = 'js'
    else if (name.endsWith('.css')) type = 'css'
    else    throw 'File has invalid extension'

    path += name

    return new ThemeFile({ name, priority, type, path })
  }

  static make(files, path = '') {
    return ThemeFile.sort(Helpers.arrayify(files).map(file => ThemeFile.from(file, path)))
  }

  static sort(files) {
    files = Helpers.dedupBy(files, 'path')
    files = Helpers.groupBy(files, 'type')

    const css = Helpers.sortBy(files.css || [], 'priority')
    const js  = Helpers.sortBy(files.js  || [], 'priority')

    return css.concat(js)
  }
}
