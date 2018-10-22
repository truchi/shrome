import View           from './View.js'
import SearchItemView from './SearchItemView.js'

export default class SearchView extends View {
  constructor(_$) {
    super(_$)

    this._$$ = {
      $items: []
    }
  }

  _preRender() {
    return this
  }

  _preRender() {
    return this
  }

  render(repos) {
    this._preRender()
    this._$.innerHTML = repos ? this._render(repos) : ''
    this._postRender(repos)

    return this
  }

  _postRender(repos) {
    this._$$ = {
      items: []
    }

    Array.from(this._$.querySelectorAll('.search-item-container'))
      .forEach(($, i) =>
        this._$$.items
          .push((new SearchItemView($)).render(repos[i]))
      )

    return this
  }

  _render(repos) {
    return `
      ${ repos.map((repo, i) => `
        <div class="search-item-container ${ i }"></div>
      `) }
    `
  }
}
