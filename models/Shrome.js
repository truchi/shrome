import Helpers from '../Helpers.js'

export default class Shrome {
  constructor({ data }) {
    this.data = data

    this.sanitized = JSON.parse(JSON.stringify(this.data))

    Helpers.mapTree(this.sanitized, (theme, data, i, d, { base, key }) => {
      if (theme.startsWith('__')) return

      const makeArr = obj => obj ? (Array.isArray(obj) ? obj : [ obj ]) : []
      data.__match  = makeArr(data.__match).map(match => Shrome.getRegExp(match))
      data.__js     = makeArr(data.__js)
      data.__css    = makeArr(data.__css)
      data.__base   = base + (data.__base || '')
      data.__key    = key  + (d !== 0 ? '.' : '') + theme // NOTE theme shouldn't contain '.' ...

      return { base: data.__base, key: data.__key }
    }, { base: '', key: '' })
  }

  files(url, theme) {
    let files = {}
    if (!theme) return files

    const data = this.sanitized[theme]

    Helpers.mapTree(data, (theme, data) => {
      if (theme.startsWith('__'))                       return true
      if (!data.__match.length)                         return true
      if (!data.__match.some(match => match.test(url))) return false

      files[data.__key] = { js: [], css: [] }
      const push = key => file =>
        files[data.__key][key].push(`${ data.__base }/${ file }`)

      data.__js .forEach(push('js' ))
      data.__css.forEach(push('css'))

      return true
    })

    return files
  }

  save() {
    const data = JSON.stringify(this.data)

    return new Promise((resolve, reject) =>
      chrome.storage.sync.set({ data }, () =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve()
      )
    )
  }

  static get() {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get('data', ({ data }) =>
        chrome.runtime.lastError
          ? reject (chrome.runtime.lastError)
          : resolve(new Shrome({ data: data ? JSON.parse(data) : {} }))
      )
    )
  }

  static getRegExp(string) {
    const pos     = string.lastIndexOf('/')
    const pattern = string.slice(1, pos)
    const flags   = string.slice(pos + 1, string.length)

    return new RegExp(pattern, flags)
  }
}
