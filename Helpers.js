export default class Helpers {
  static mapTree(tree, cb, init) {
    return Helpers._mapTree(tree, cb, 0, init)
  }

  static _mapTree(tree, cb, depth, ret) {
    return Object.entries(tree)
      .map(([ key, value ], index) => {
        const r = cb(key, value, Number(index), Number(depth), ret)

        r !== false && Helpers.isObject(value)
          && Helpers._mapTree(value, cb, depth + 1, r)
      })
  }

  static isObject(object) {
    return object !== null && object !== undefined && object.constructor === Object
  }

  static groupBy(object, key) {
    return Object.entries(object).reduce((o, [ k, v ]) => {
      const value = v[key]
      o[value] || (o[value] = [])
      o[value].push(v)

      return o
    }, {})
  }

  static sortBy(object, key, fn = null) {
    return Helpers.flat(
      Object.entries(Helpers.groupBy(object, key))
        .sort(fn ? (entry1, entry2) => fn(entry1[0], entry2[0]) : undefined)
        .map (entry => entry[1])
    )
  }

  static dedupBy(object, key) {
    return object.filter((elem, i) => i === object.findIndex(e => elem[key] === e[key]))
  }

  static arrayify(obj) {
    return obj ? (Array.isArray(obj) ? obj : [ obj ]) : []
  }

  static ajax(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) resolve(xhr.responseText)
          else                    reject (xhr.status === 0
                                          ? 'Unknown error'
                                          : xhr.status + (xhr.statusText ? ' ' + xhr.statusText : '')
                                         )
        }
      }

      xhr.open('GET', url, true)
      xhr.send()
    })
  }

  static trim(string, trim = ' ') {
    trim = Helpers.regexpify(trim)

    return string.replace(new RegExp(`^${ trim }+|${ trim }+$`, 'g'), '')
  }

  static regexpify(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  static merge(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()

    if (Helpers._mergeIsObject(target) && Helpers._mergeIsObject(source)) {
      for (const key in source) {
        if (Helpers._mergeIsObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          Helpers.merge(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }

    return Helpers.merge(target, ...sources)
  }

  static _mergeIsObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  static flat(arrays) {
    return [].concat.apply([], arrays)
  }
}
