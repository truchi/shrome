const attribute = '__added-by-shrome'

const inject = (tag, text) => {
  const node = document.createElement(tag)
  node.innerText = text
  node.setAttribute(attribute, true)
  document.body.appendChild(node)
}

const clear = () => {
  ;[...document.querySelectorAll(`[${ attribute }]`)].forEach(tag => tag.remove())
}

const onMessage = data => {
  clear()
  data.files.css.map(css => inject('style' , css))
  data.files.js .map(js  => inject('script', js ))
}

chrome.runtime.onMessage.addListener(onMessage)
