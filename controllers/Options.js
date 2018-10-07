import User     from '../models/User.js'
import Messager from './Messager.js'

export default class Options extends Messager {
  constructor({ treeView }) {
    super()

    Object.assign(this, { _user: null, _treeView: treeView })
    this._onActivation = this._onActivation.bind(this)

    this.send('background', 'send-user', null, this._init)
    this._attach()
  }

  _init({ user }) {
    this._user = User.from(user)
    this._display()

    window.user = this._user // TODO remove
    console.log(this._user)

    return this
  }

  _attach() {
    this._treeView.on('activation', this._onActivation)

    return this
  }

  _onActivation({ detail: { id, on } }) {
    this.send('background', 'activation', { id, on }, this._init)

    return this
  }

  _display() {
    this._treeView.render(this._user.viewData())

    return this
  }
}
