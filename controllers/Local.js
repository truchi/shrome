import BaseRequest from './BaseRequest.js'

export default class Local extends BaseRequest {
  constructor({ url }) {
    super()

    this._url = url
  }

  themes() {
    const file = BaseRequest.url(this._url, '.shrome.json')
    const url  = this._url

    return new Promise((resolve, reject) =>
      this.get(file)
        .then (themes => resolve({ themes, url }))
        .catch(error  => reject(`${ file }: ${ error }`))
    )
  }

  getFile(file) {
    return this.get(BaseRequest.url(this._url, file))
  }
}
