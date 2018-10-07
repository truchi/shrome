import Source  from './views/Source.js'
import Config  from './views/Config.js'
import Options from './controllers/Options.js'
import Request from './controllers/Request.js'
import User    from './models/User.js'
import Repo    from './models/Repo.js'
import Theme   from './models/Theme.js'
import TreeView from './views/TreeView.js'

const user = new User({})
window.user = user

const discover = () => {
  Request.discover()
    .then(repos => {
      const repo = repos[0]

      Request.theme(repo)
        .then(theme => {
          user.repo  = repo
          repo.theme = theme
          console.log('user', user, repo)

          const treeView = new TreeView(document.getElementById('tree-view'))

          chrome.windows.getAll(
            { populate: true },
            (windows) => {
              windows.forEach(window => window.tabs.forEach(tab => user.url(tab.id, tab.url)))
              treeView.render(user.viewData())
                .on('activation', (e) => {
                  console.log(e.detail)
                })
            }
          )

          chrome.tabs.onUpdated.addListener((id, info, tab) => {
            if (info.status && info.status === 'complete') {
              const files = user.url(id, tab.url)
              treeView.render(user.viewData())
            }
          })

          chrome.tabs.onRemoved.addListener(id => {
            console.log('removed', id, user.tabs)
            user.url(id)
            treeView.render(user.viewData())
          })

          theme.on([ 1, 6, 7, 18 ])

          const user2 = User.from(user.intermediate())
          window.user2 = user

          // user.url(9999999999, 'https://www.youtube.com', Request.files)
          //   .then(files => {
          //     console.log(files)
          //   })
        })
    })
}

const testRequest = () => {
  const test = (data) => {
    Request.repo(data)
      .then(repo => {
        Request.theme(repo)
          .then(theme => {
            console.log(data.provider, repo, theme)
          })
      })
  }

  test({
    url: 'http://localhost:8080/',
    provider: 'local'
  })
  test({
    name: 'shrome-themes',
    user: { name: 'truchi' },
    provider: 'github'
  })
}

discover()
// testRequest()

// const $source = document.getElementById('source')
// const $config = document.getElementById('config')

// const source  = new Source($source)
// const config  = new Config($config)
// const options = new Options({ source, config })
