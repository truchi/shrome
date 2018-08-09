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

chrome.webNavigation.onCompleted.addListener((navigation) => {
  if (navigation.frameId !== 0) return
  console.log(navigation.tabId, navigation.url)

  if (!navigation.url.startsWith('chrome://')) {
    chrome.tabs.insertCSS(navigation.tabId, {
      code: '* {color:blue}'
    })
  }
})
