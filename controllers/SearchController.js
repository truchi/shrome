import Repo     from '../models/Repo.js'
import Messager from './Messager.js'

export default class SearchController extends Messager {
  constructor(_searchView) {
    super()

    Object.assign(this, { _repos: null, _searchView })

    this._init()
  }

  _init() {
    this.send('background', 'send-repos', null, this._load)

    return this
  }

  _load({ repos }) {
    this._repos = repos.map(repo => Repo.from(repo))
    this._searchView.render(this._repos)

    window.repos = this._repos // TODO remove
    console.log(this._repos)

    return this
  }
}
