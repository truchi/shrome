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

  render(data) {
    this.detach()

    this.$table.innerHTML = `
      <div class="local">Local: <span>${ data.local }</span></div>
      ${ this.compileThemes(data.themes) }
    `

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
    const files = data.__files

    return `
      <li class="theme">
        <div class="name">
          ${ depth === 0 ? `<input id="table_theme_${ theme }" type="radio" name="theme" value="${ theme }">` : '' }
          <label for="table_theme_${ theme }">${ theme }</label>
        </div>
        ${ match ? `Match: <ul class="matches">${ match.map(match => `<li class="match">${ match }</li>`).join('') }</ul>` : '' }
        ${ base  ? `<div class="base">Base: <span>${ base }</span></div>` : '' }
        ${ files ? `Files: <ul class="files">${ files.map(file => `<li class="file">${ file }</li>`).join('') }</ul>` : '' }
        ${ this.compileThemes(data, ++depth) }
      </li>
    `
  }
}

window.Table = Table
