import Helpers from '../Helpers.js'

export default class ThemeFile {
  constructor({ id, parentId, name, priority, type, path, on = false }) {
    Object.assign(this, { id, parentId, name, priority, type, path, on })
  }

  clone() {
    return new ThemeFile(this)
  }

  static sanitize(file, path = '') {
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

    return { name, priority, type, path }
  }

  static sort(files) {
    files = Helpers.dedupBy(files, 'path')
    files = Helpers.groupBy(files, 'type')

    const css = Helpers.sortBy(files.css || [], 'priority')
    const js  = Helpers.sortBy(files.js  || [], 'priority')

    return css.concat(js)
  }
}
