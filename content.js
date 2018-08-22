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

const onMessage = files => {
  clear()
  files
    .filter (file => file.content)
    .forEach(file => inject(tag(file.type), file.content))
}

const tag = (type) => {
  switch (type) {
    case 'js':
      return 'script'
    case 'css':
      return 'style'
  }
}

chrome.runtime.onMessage.addListener(onMessage)
