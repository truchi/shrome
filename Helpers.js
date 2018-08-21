export default class Helpers {
  static mapTree(tree, cb) {
    return Helpers._mapTree(tree, cb, 0)
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
}
