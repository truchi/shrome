// requires 'controllers/Background.js'

const background = new Background()

chrome.webNavigation.onCompleted.addListener(background.onCompleted.bind(background))
