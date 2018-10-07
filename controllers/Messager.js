export default class Messager {
  on(_for) {
    return (name, cb) =>
      chrome.runtime.onMessage.addListener((message, sender, respond) =>
        message.for === _for && message.name === name && cb.call(this, message.data, respond)
      )
  }

  send(_for, name, data, onResponse) {
    const message = { for: _for, name, data }

    chrome.runtime.sendMessage(message, onResponse.bind(this))

    return this
  }
}
