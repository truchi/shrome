import Helpers from '../Helpers.js'
import User    from '../models/User.js'

export default class Background {
  constructor() {
    this._user      = null
    this._attach    = this._attach   .bind(this)
    this._onMessage = this._onMessage.bind(this)

    User.load()
      .then(user => this._user = user)
      .then(this._attach)
  }

  _attach() {
    chrome.runtime.onMessage.addListener(this._onMessage)
  }

  _onMessage(message, sender, respond) {
    if (message === 'sendUser') respond({ user: this._user.intermediate() })

    return this
  }
}
