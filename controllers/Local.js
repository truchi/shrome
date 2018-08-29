import BaseRequest from './BaseRequest.js'

export default class Local extends BaseRequest {
  constructor({ url }) {
    super()

    this._url = url.replace(/\/*$/, '/')
  }

  themes() {
    const url  = this._url
    const file = url + '.shrome.json'

    return new Promise((resolve, reject) =>
      this.file(file)
        .then (themes => resolve({ themes, url }))
        .catch(error  => reject(`${ file }: ${ error }`))
    )
  }
}
