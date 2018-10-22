import View from './View.js'

export default class SearchItemView extends View {
  constructor(_$) {
    super(_$)
  }

  _preRender() {
    return this
  }

  render(repo) {
    this._preRender()
    this._$.innerHTML = repo ? this._render(repo) : ''
    this._postRender()

    return this
  }

  _postRender() {
    return this
  }

  _render(repo) {
    return `
      <div class="repo">
        <div class="top">
          <a class="user-link" href="${ repo.user.url }" target="_blank">
            <img src="${ repo.user.img }" />
          </a>
          <a class="repo-link" href="${ repo.url }" target="_blank">
            <div class="name">${ repo.user.name }/${ repo.name }</div>
          </a>
          <a class="head-link" href="${ repo.head.url }" target="_blank" title="${ repo.head.sha }">
            <div class="date">${ repo.head.date }</div>
          </a>
        </div>
        <div class="bottom">
          <i class="provider" provider="${ repo.provider }"></i>
          <i class="favorite"></i>
          <i class="active"></i>
        </div>
      </div>
    `
  }
}
