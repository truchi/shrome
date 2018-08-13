// requires 'controllers/Background.js'

const background = new Background()
chrome.windows.getAll({ populate: true }, (windows) => {
  console.log(windows)

  for (let window of windows) {
    for (let tab of window.tabs) {
      console.log(window.id, tab.id, tab.url)

      if (!tab.url.startsWith('chrome://')) {
        chrome.tabs.insertCSS(tab.id, {
          code: '* {color:red}'
        })
      }
    }
  }
})

chrome.webNavigation.onCompleted.addListener(background.onCompleted.bind(background))
