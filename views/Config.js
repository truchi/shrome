import View from './View.js'

export default class Config extends View {
  constructor(_$) {
    super(_$)

    this._$radios = []
    this._theme   = null

    this._onRadio = this._onRadio.bind(this)
  }

  _attach() {
    this._$radios = [].slice.call(this._$.getElementsByTagName('input'))
    this._$radios.forEach($radio => $radio.addEventListener('click', this._onRadio))
  }

  _detach() {
    this._$radios.forEach($radio => $radio.removeEventListener('click', this._onRadio))
    this._$radios = []
  }

  _onRadio(e) {
    const prev  = this._theme
    let   theme = e.target.value

    if (theme === prev) {
      e.target.checked = false
      theme    = null
    }

    this._theme = theme

    this._dispatch('theme', { theme })
  }

  render({ data, theme }) {
    this._detach()

    this._$.innerHTML = data
      ? this._compileThemes(data)
      : ''

    if (theme) this._$.querySelector(`input[value="${ theme }"]`).checked = true

    this._attach()

    return this
  }

  _compileThemes(themes, depth = 0) {
    const html = Object.entries(themes)
      .filter(([ theme, data ]) => !theme.startsWith('__'))
      .map(([ theme, data ]) => this._compileTheme(theme, data, depth))
      .reduce((html, part) => html += part, '')

    return html ? `<ul class="themes">${ html }</ul>` : ''
  }

  _compileTheme(theme, data, depth) {
    const match = data.__match ? Array.isArray(data.__match) ? data.__match : [ data.__match ] : null
    const base  = data.__base
    const js    = data.__js
    const css   = data.__css

    return `
      <li class="theme">
        <div class="name">
          <label>
            ${ depth === 0 ? `<input type="radio" name="theme" value="${ theme }">` : '' }
            <b>${ theme }</b>
          </label>
        </div>
        ${ match ? `Match: <ul class="matches">${ match.map(match => `<li class="match">${ match }</li>`).join('') }</ul>` : '' }
        ${ base  ? `<div class="base">Base: <span>${ base }</span></div>` : '' }
        ${ js    ? `JS: <ul class="js">${ js.map(js => `<li class="file">${ js }</li>`).join('') }</ul>` : '' }
        ${ css   ? `CSS: <ul class="css">${ css.map(css => `<li class="file">${ css }</li>`).join('') }</ul>` : '' }
        ${ this._compileThemes(data, ++depth) }
      </li>
    `
  }
}
