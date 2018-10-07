import Helpers  from '../Helpers.js'
import User     from '../models/User.js'
import Messager from './Messager.js'
import Request  from './Request.js'

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

    this._dev() // TODO remove
    return this
  }

  _onSendUser(data, respond) {
    respond({ user: this._user.intermediate() })

    return this
  }

  _onActivation({ id, on }, respond) {
    this._user.repo.theme.set(id, on)
    respond({ user: this._user.intermediate() })

    return this
  }

  _dev() {
    Request.repo({
      name: 'shrome-themes',
      user: { name: 'truchi' },
      provider: 'github'
    })
      .then(repo => {
        Request.theme(repo)
          .then(theme => {
            repo.theme = theme
            this._user.repo = repo
            window.user = this._user
          })
      })
  }
}
