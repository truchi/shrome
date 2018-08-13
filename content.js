const attribute = '__added-by-shrome'

const inject = (tag, text) => {
  const node = document.createElement(tag)
  node.innerText = text
  node.setAttribute(attribute, true)
  document.body.appendChild(node)
}

const clear = () => {
  [...document.querySelectorAll(`[${ attribute }]`)].forEach(tag => tag.remove())
}

const onMessage = request => {
  clear()
  request.files.js .map(js  => inject('script', js ))
  request.files.css.map(css => inject('style' , css))
}

chrome.runtime.onMessage.addListener(onMessage)