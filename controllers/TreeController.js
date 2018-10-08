import User     from '../models/User.js'
import Messager from './Messager.js'

export default class TreeController extends Messager {
  constructor(_treeView) {
    super()

    Object.assign(this, { _user: null, _treeView })
    this._onActivation = this._onActivation.bind(this)

    this._init()
  }

  _init() {
    this.send('background', 'send-user', null, this._load)
    this._attach()

    return this
  }

  _load({ user }) {
    this._user = User.from(user)
    this._treeView.render(this._user.treeData())

    window.user = this._user // TODO remove
    console.log(this._user)

    return this
  }

  _attach() {
    this._treeView.on('activation', this._onActivation)

    return this
  }

  _onActivation({ detail: { id, on } }) {
    this.send('background', 'activation', { id, on }, this._load)

    return this
  }
}
