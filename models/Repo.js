export default class Repo {
  constructor(data = {}) {
    const defaults = {
      name    : '',
      desc    : '',
      url     : '',
      provider: '',
      theme   : null,
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
}
