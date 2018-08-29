export default class BaseRequest {
  file(url) {
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
}
