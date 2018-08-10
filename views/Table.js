class Table {
  constructor({ $table }) {
    this.$table = $table
  }

  render(data) {
    this.$table.innerHTML = `
      <div class="local">Local: <span>${ data.local }</span></div>
      ${ this.compileThemes(data.themes) }
    `
  }

  compileThemes(themes) {
    const html = Object.entries(themes)
      .filter(([ theme, data ]) => !theme.startsWith('__'))
      .map(([ theme, data ]) => this.compileTheme(theme, data))
      .reduce((html, part) => html += part, '')

    return html ? `<ul class="themes">${ html }</ul>` : ''
  }

  compileTheme(theme, data) {
    const match = data.__match ? Array.isArray(data.__match) ? data.__match : [ data.__match ] : null
    const base  = data.__base
    const files = data.__files

    return `
      <li class="theme">
        <div class="name">${ theme }</div>
        ${ match ? `Match: <ul class="matches">${ match.map(match => `<li class="match">${ match }</li>`).join('') }</ul>` : '' }
        ${ base  ? `<div class="base">Base: <span>${ base }</span></div>` : '' }
        ${ files ? `Files: <ul class="files">${ files.map(file => `<li class="file">${ file }</li>`).join('') }</ul>` : '' }
        ${ this.compileThemes(data) }
      </li>
    `
  }
}

window.Table = Table
