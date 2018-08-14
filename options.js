const $form  = document.getElementById('git')
const $table = document.getElementById('table')

const git     = new Git    ({ $form      })
const table   = new Table  ({ $table     })
const options = new Options({ git, table })
