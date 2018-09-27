import Source  from './views/Source.js'
import Config  from './views/Config.js'
import Options from './controllers/Options.js'
import Github  from './controllers/Github.js'

Github.discover()
  .then(repos => {
    console.log(repos)
  })

const $source = document.getElementById('source')
const $config = document.getElementById('config')

const source  = new Source($source)
const config  = new Config($config)
const options = new Options({ source, config })
