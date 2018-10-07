import Helpers from '../Helpers.js'

export default class ThemeFile {
  constructor({ id, parentId, name, priority, type, url, on = true }) {
    Object.assign(this, { id, parentId, name, priority, type, url, on })
  }

  clone() {
    return ThemeFile.from(this)
  }

  intermediate() {
    const { id, parentId, name, priority, type, url, on } = this

    return { id, parentId, name, priority, type, url, on }
  }

  static sanitize(file, url = '') {
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

    url += name

    return { name, priority, type, url }
  }

  static sort(files) {
    files = Helpers.dedupBy(files, 'url')
    files = Helpers.groupBy(files, 'type')

    const css = Helpers.sortBy(files.css || [], 'priority')
    const js  = Helpers.sortBy(files.js  || [], 'priority')

    return css.concat(js)
  }

  static from(intermediate) {
    return new ThemeFile(intermediate)
  }
}
