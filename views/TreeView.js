import View from './View.js'

export default class TreeView extends View {
  constructor(_$) {
    super(_$)
  }

  render(data) {
    console.log(data)

    return this._$.innerHTML = this._renderSubtheme(data, true)
  }

  _renderSubtheme(subtheme, first = false) {
    return `
      <div class="subtheme" id="${ subtheme.id }" ${ subtheme.on ? 'on' : 'off' }>
        ${ first ? '' : this._renderCheckbox(subtheme) }
        <div class="name">${ subtheme.name }</div>
        <div class="regexps">
          ${ subtheme.regexps.map(regexp => this._renderRegexp(regexp)).join('') }
        </div>
        <div class="files">
          ${ subtheme.files.map(file => this._renderFile(file)).join('') }
        </div>
        <div class="children">
          ${ subtheme.children.map(subtheme => this._renderSubtheme(subtheme)).join('') }
        </div>
      </div>
    `
  }

  _renderFile(file) {
    return `
      <div class="file" id="${ file.id }" type="${ file.type }">
        ${ this._renderCheckbox(file) }
        <i></i>
        <div class="name">${ file.name }</div>
      </div>
    `
  }

  _renderRegexp(regexp) {
    return `
      <div class="regexp" id="${ regexp.id }">
        ${ this._renderCheckbox(regexp) }
        <i></i>
        <div class="name">/${ regexp.regexp.source }/${ regexp.regexp.flags }</div>
      </div>
    `
  }

  _renderCheckbox({ id, on }) {
    return `<input class="toggle" type="checkbox" id="${ id }" ${ on ? 'checked' : '' }>`
  }
}
