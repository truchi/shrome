import Theme from './Theme.js'

export default class Repo {
  constructor(data = {}) {
    const defaults = {
      name    : '',
      desc    : '',
      url     : '',
      provider: '',
      theme   : new Theme({}),
      head: {
        branch: '',
        sha   : '',
        url   : '',
        date  : ''
      },
      user: {
        name: '',
        url : '',
        img : ''
      }
    }

    this.name     = data.name     || defaults.name
    this.desc     = data.desc     || defaults.desc
    this.url      = data.url      || defaults.url
    this.provider = data.provider || defaults.provider
    this.theme    = data.theme    || defaults.theme
    this.head     = Object.assign({}, defaults.head, data.head || {})
    this.user     = Object.assign({}, defaults.user, data.user || {})
  }

  intermediate() {
    const { name, desc, url, provider, head, user } = this
    const theme = this.theme.intermediate()

    return { name, desc, url, provider, theme, head, user }
  }

  static from(intermediate) {
    let { name, desc, url, provider, theme, head, user } = intermediate
    theme = Theme.from(theme)

    return new Repo({ name, desc, url, provider, theme, head, user })
  }
}
