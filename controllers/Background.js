import Helpers  from '../Helpers.js'
import User     from '../models/User.js'
import Messager from './Messager.js'

export default class Background extends Messager {
  constructor() {
    super()

    this._user   = null
    this._attach = this._attach.bind(this)

    User.load()
      .then(user => this._user = user)
      .then(this._attach)
  }

  _attach() {
    const on = this.on('background')

    on('sendUser'  , this._onSendUser  )
    on('activation', this._onActivation)

    return this
  }

  _onSendUser(data, respond) {
    respond({ user: this._user.intermediate() })

    return this
  }

  _onActivation({ id, on }, respond) {
    respond({ user: this._user.intermediate() })

    return this
  }
}
