import Helpers from '../Helpers.js'

export default class ThemeFile {
  constructor({ themeId, index, name, priority, type, path }) {
    this.themeId  = themeId
    this.index    = index
    this.name     = name
    this.priority = priority
    this.type     = type
    this.path     = path
  }

  clone() {
    const themeId  = this.themeId
    const index    = this.index
    const name     = this.name
    const priority = this.priority
    const type     = this.type
    const path     = this.path

    return new ThemeFile({ themeId, index, name, priority, type, path })
  }

  static from(themeId, index, file, path = '') {
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

    return new ThemeFile({ themeId, index, name, priority, type, path })
  }

  static make(themeId, files, path = '') {
    return ThemeFile.sort(Helpers.arrayify(files).map(file => ThemeFile.from(themeId, null, file, path)))
      .map((file, index) => { file.index = index; return file })
  }

  static sort(files) {
    files = Helpers.dedupBy(files, 'path')
    files = Helpers.groupBy(files, 'type')

    const css = Helpers.sortBy(files.css || [], 'priority')
    const js  = Helpers.sortBy(files.js  || [], 'priority')

    return css.concat(js)
  }
}
