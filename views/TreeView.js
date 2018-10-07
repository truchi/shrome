import View from './View.js'

export default class TreeView extends View {
  constructor(_$) {
    super(_$)

    this._$$           = {}
    this._onFolding    = this._onFolding.bind(this)
    this._onActivation = this._onActivation.bind(this)
  }

  _onFolding(e) {
    const $folding = e.target
    const id       = $folding.getAttribute('for')
    const state    = $folding.getAttribute('state')

    state === "expanded"
      ? this._collapse(id)
      : this._expand  (id)

    return this
  }

  _expand(id) {
    const $folding = this._$$[id].$folding
    const $content = this._$$[id].$content
    const height   = $content.getAttribute('height')

    $content.style.maxHeight = `${ height }px`
    $folding.setAttribute('state', 'expanded')

    return this
  }

  _collapse(id) {
    const $folding = this._$$[id].$folding
    const $content = this._$$[id].$content

    $content.style.maxHeight = '0'
    $folding.setAttribute('state', 'collapsed')

    return this
  }

  _onActivation(e) {
    const $activation = e.target
    const id          = $activation.getAttribute('for')
    const on          = $activation.checked

    this._dispatch('activation', { id, on })

    return this
  }

  _preRender() {
    Object.values(this._$$)
      .forEach($$ => {
        $$.$folding.removeEventListener('click', this._onFolding)
        $$.$activations.forEach($ => $.removeEventListener('click', this._onActivation))
      })

    return this
  }

  render(data) {
    this._preRender()
    this._$.innerHTML = data ? this._renderSubtheme(data, true) : ''
    this._postRender()

    return this
  }

  _postRender() {
    this._$$ = {}

    Array.from(this._$.querySelectorAll('.subtheme'))
      .forEach($subtheme => {
        const id           = $subtheme.getAttribute('subtheme-id')
        const $folding     = $subtheme.querySelector('.folding')
        const $activations = Array.from($subtheme.querySelectorAll('.activation'))
        const $content     = $subtheme.querySelector('.content')

        $folding.addEventListener('click', this._onFolding)
        $activations.forEach($ => $.addEventListener('click', this._onActivation))

        const height = $content.clientHeight
        $content.setAttribute('height', height)
        $content.style.maxHeight = `${ height }px`

        this._$$[id] = { $subtheme, $folding, $activations, $content }
      })

    return this
  }

  _renderSubtheme(subtheme, first = false) {
    return `
      <div class="subtheme" subtheme-id="${ subtheme.id }" ${ subtheme.on ? 'on' : 'off' }>
        ${ first ? '' : `<i class="folding" for="${ subtheme.id }" state="expanded" ></i>` }
        ${ first ? '' : this._renderCheckbox(subtheme) }
        <div class="name">${ subtheme.name }</div>
        <div class="content">
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
      </div>
    `
  }

  _renderFile(file) {
    return `
      <div class="file" file-id="${ file.id }" type="${ file.type }" ${ file.on ? 'on' : 'off' }>
        ${ this._renderCheckbox(file) }
        <i class="icon"></i>
        <a class="name" href="${ file.url }" target="_blank" title="${ file.error || '' }">${ file.name }</a>
      </div>
    `
  }

  _renderRegexp(regexp) {
    return `
      <div class="regexp" regexp-id="${ regexp.id }" ${ regexp.on ? 'on' : 'off' }>
        ${ this._renderCheckbox(regexp) }
        <i class="icon"></i>
        <div class="name">/${ regexp.regexp.source }/${ regexp.regexp.flags }</div>
      </div>
    `
  }

  _renderCheckbox({ id, on }) {
    return `<input class="activation" type="checkbox" for="${ id }" ${ on ? 'checked' : '' }>`
  }
}
