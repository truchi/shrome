import Helpers from '../Helpers.js'

export default class ThemeFile {
  constructor(file, path = '') {
    let name     = ''
    let priority = 0
    let type     = ''
    let url      = ''

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

    url = path + name

    this.name     = name
    this.priority = priority
    this.type     = type
    this.url      = url
  }

  static make(files, path = '') {
    return ThemeFile.sort(Helpers.arrayify(files).map(file => new ThemeFile(file, path)))
  }

  static sort(files) {
    files = Helpers.dedupBy(files, 'url')
    files = Helpers.groupBy(files, 'type')

    const css = Helpers.sortBy(files.css || [], 'priority')
    const js  = Helpers.sortBy(files.js  || [], 'priority')

    return css.concat(js)
  }
}
