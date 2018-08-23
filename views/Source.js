import View from './View.js'

export default class Source extends View {
  constructor(_$) {
    super(_$)

    this._onForm = this._onForm.bind(this)
  }

  _attach() {
    this._$github  = this._$.querySelector('.github')
    this._$local   = this._$.querySelector('.local')
    this._$user    = this._$.querySelector('.user')
    this._$repo    = this._$.querySelector('.repo')
    this._$icon    = this._$.querySelector('.icon')
    this._$message = this._$.querySelector('.message')
    this._$url     = this._$.querySelector('.url')

    this._$      .addEventListener('submit', this._onForm)
    this._$github.addEventListener('change', this._onForm)
    this._$local .addEventListener('change', this._onForm)

    return this
  }

  _detach() {
                     this._$      .removeEventListener('submit', this._onForm)
    this._$github && this._$github.removeEventListener('change', this._onForm)
    this._$local  && this._$local .removeEventListener('change', this._onForm)

    return this
  }

  _onForm(e) {
    const local = this._$local.checked
    const user  = this._$user .value
    const repo  = this._$repo .value
    const url   = this._$url  .value

    this._dispatch('change', { local, user, repo, url })

    e.preventDefault()
    e.stopPropagation()

    return this
  }

  render({ local, user, repo, url, error }) {
    this._detach()
      ._rememberFocus()

    this._$.innerHTML = `
      <label>
          <input class="github" type="radio" name="local" value="0" ${ local ? '' : 'checked="true"' }>
          <b>Github</b>
      </label>
      <input class="user" type="text" placeholder="user" value="${ user }">/
      <input class="repo" type="text" placeholder="repo" value="${ repo }">
      <br>
      <label>
          <input class="local" type="radio" name="local" value="1" ${ local ? 'checked="true"' : '' }">
          <b>Local</b>
      </label>
      <input class="url" type="text" placeholder="URL" value="${ url }">
      <i class="icon ${ error ? 'ko' : 'ok' }"></i>
      <span class="message">${ error || '' }</span>
      <input type="submit" style="display:none" />
    `

    this._attach()
      ._restoreFocus()

    return this
  }

  _rememberFocus() {
    const $el = document.activeElement

    this._focused = {
      value             : $el && $el.classList.value,
      selectionStart    : $el && $el.selectionStart,
      selectionEnd      : $el && $el.selectionEnd,
      selectionDirection: $el && $el.selectionDirection
    }

    return this
  }

  _restoreFocus() {
    let $el = null

    switch (this._focused.value) {
      case 'user':
        $el = this._$user
        break
      case 'repo':
        $el = this._$repo
        break
      case 'url':
        $el = this._$url
        break
    }

    if ($el) {
      $el.focus()
      $el.selectionStart     = this._focused.selectionStart
      $el.selectionEnd       = this._focused.selectionEnd
      $el.selectionDirection = this._focused.selectionDirection
    }

    this._focused = {}

    return this
  }
}
