export default class View {
  constructor(_$) {
    this._$ = _$
  }

  on(name, cb) {
    this._$.addEventListener(this._name(name), cb)

    return this
  }

  off(name, cb) {
    this._$.off.removeEventListener(this._name(name), cb)

    return this
  }

  _dispatch(name, data) {
    return this._$.dispatchEvent(new CustomEvent(this._name(name), { detail: data }))
  }

  _name(name) {
    return `__shrome_${ this.constructor.name }:${ name }`
  }
}
