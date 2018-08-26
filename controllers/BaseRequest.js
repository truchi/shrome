export default class BaseRequest {
  get(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) resolve(xhr.responseText)
          else                    reject (xhr.status === 0
                                          ? 'Unknown error'
                                          : xhr.status + ' ' + xhr.statusText
                                         )
        }
      }

      xhr.open('GET', url, true)
      xhr.send()
    })
  }

  static url(url, file) {
    url  = url .replace(/\/+$/, '')
    file = file.replace(/^\/+/, '')

    return `${ url }/${ file }`
  }
}
