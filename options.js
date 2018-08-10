const $form    = document.getElementById('git')
const $user    = document.getElementById('user')
const $repo    = document.getElementById('repo')
const $icon    = $form.getElementsByClassName('icon')[0]
const $message = $form.getElementsByClassName('message')[0]
const $table   = document.getElementById('table')

const git = new Git({
  $form,
  $user,
  $repo,
  $icon,
  $message
})

const table = new Table({
  $table
})

const options = new Options({
  git,
  table
})
