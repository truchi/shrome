const $form    = document.getElementById('git')
const $user    = document.getElementById('user')
const $repo    = document.getElementById('repo')
const $icon    = $form.getElementsByClassName('icon')[0]
const $message = $form.getElementsByClassName('message')[0]

const git = new Git({
  $form,
  $user,
  $repo,
  $icon,
  $message
})

const options = new Options({
  git
})
