import Source from './views/Source.js'
import Config from './views/Config.js'

const $source = document.getElementById('source')
const $config = document.getElementById('config')

const source  = new Source($source)
const config  = new Config($config)
const options = new Options({ source, config })
