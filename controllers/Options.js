import User from '../models/User.js'

export default class Options {
  constructor({ treeView }) {
    Object.assign(this, { _user: null, _treeView: treeView })
    this._init = this._init.bind(this)

    chrome.runtime.sendMessage('sendUser', this._init)
  }

  _init({ user }) {
    this._user = User.from(user)
    this._attach()
    this._display()

    console.log(this._user)

    return this
  }

  _attach() {
    this._treeView.on('activation', this._onActivation)

    return this
  }

  _onActivation({ id, on }) {
    console.log({ id, on })

    return this
  }

  _display() {
    this._treeView.render(this._user.viewData())

    return this
  }
}
