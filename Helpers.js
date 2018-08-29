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

  static arrayify(obj) {
    return obj ? (Array.isArray(obj) ? obj : [ obj ]) : []
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
}
