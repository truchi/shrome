import Source  from './views/Source.js'
import Config  from './views/Config.js'
import Options from './controllers/Options.js'
import Github  from './controllers/Github.js'
import User    from './models/User.js'
import Theme   from './models/Theme.js'

const u = new User()
console.log(u)
console.log(User.parse(User.serialize(u)))

const t = new Theme({
  "__files": ["/icimain.js", "/icidark.css", "/youtube/watch/dark.css"],
  "__matches": "https://www.youtube.com",
  "shracula": {
    "youtube": {
      "__path": "/youtube",
      "__files": ["/icimain.js", "/icidark.css"],
      "index": {
        "__matches": "/^https:\\/\\/www\\.youtube\\.com\\/?$/",
        "__path": "/index",
        "__files": ["/main.js", "/other.js", "/dark.css"]
      },
      "list": {
        "__matches": "/^https:\\/\\/www\\.youtube\\.com\\/?$/",
        "__path": "/list",
        "__files": "/main.js"
      },
      "watch": {
        "__matches": "/^https:\\/\\/www\\.youtube\\.com\\/?$/",
        "__path": "/watch",
        "__files": [{
          "name": "/main.js",
          "priority": 1
        }, {
          "name": "/darkTEST.css",
          "priority": 10
        }, {
          "name": "/darkTEST.css",
          "priority": 10
        }, {
          "name": "/dark.css",
          "priority": 1
        }]
      }
    }
  }
})
window.t = t
// Github.discover()
//   .then(repos => {
//     console.log(repos)
//   })

const $source = document.getElementById('source')
const $config = document.getElementById('config')

const source  = new Source($source)
const config  = new Config($config)
const options = new Options({ source, config })
