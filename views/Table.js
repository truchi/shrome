class Table {
  constructor({ $table }) {
    this.$table  = $table
    this.$radios = []
    this.theme   = null

    this.$dispatcher = this.$table

    this.onRadio = this.onRadio.bind(this)
  }

  attach() {
    this.$radios = [].slice.call(this.$table.getElementsByTagName('input'))
    this.$radios.forEach($radio => $radio.addEventListener('click', this.onRadio))
  }

  detach() {
    this.$radios.forEach($radio => $radio.removeEventListener('click', this.onRadio))
    this.$radios = []
  }

  onRadio(e) {
    const prev  = this.theme
    let   theme = e.target.value

    if (theme === prev) {
      e.target.checked = false
      theme    = null
    }

    this.theme = theme

    const event = new CustomEvent('table:theme', { detail: { theme: this.theme } })
    this.$dispatcher.dispatchEvent(event)
  }

  render({ data, theme }) {
    this.detach()

    this.$table.innerHTML = `
      <div class="local">Local: <span>${ data.local }</span></div>
      ${ this.compileThemes(data.themes) }
    `

    const $radio = this.$table.querySelector(`input[value="${ theme }"]`)
    if ($radio) $radio.checked = true

    this.attach()
  }

  compileThemes(themes, depth = 0) {
    const html = Object.entries(themes)
      .filter(([ theme, data ]) => !theme.startsWith('__'))
      .map(([ theme, data ]) => this.compileTheme(theme, data, depth))
      .reduce((html, part) => html += part, '')

    return html ? `<ul class="themes">${ html }</ul>` : ''
  }

  compileTheme(theme, data, depth) {
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
        ${ this.compileThemes(data, ++depth) }
      </li>
    `
  }
}

window.Table = Table
