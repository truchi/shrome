import BaseRequest from './BaseRequest.js'

export default class Local extends BaseRequest {
  constructor({ url }) {
    super()

    this._url = url
  }

  getConfig() {
    const url = BaseRequest.url(this._url, '.shrome.json')

    return new Promise((resolve, reject) =>
      this.get(url)
        .then (config => resolve({ config }))
        .catch(error  => reject(`${ url }: ${ error }`))
    )
  }

  getFile(file) {
    return this.get(BaseRequest.url(this._url, file))
  }
}
