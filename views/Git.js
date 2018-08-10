class Git {
  constructor({ $form, $user, $repo, $icon, $message }) {
    this.$form    = $form
    this.$user    = $user
    this.$repo    = $repo
    this.$icon    = $icon
    this.$message = $message

    this.$dispatcher = this.$form

    this.onForm = this.onForm.bind(this)

    this.attach()
  }

  attach() {
    this.$form.addEventListener('submit', this.onForm)
    this.$user.addEventListener('input' , this.onForm)
    this.$repo.addEventListener('input' , this.onForm)
  }

  onForm() {
    const user = this.$user.value
    const repo = this.$repo.value

    const event = new CustomEvent('git:form', { detail: { user, repo } })
    this.$dispatcher.dispatchEvent(event)

    return this
  }

  render({ user, repo, ok = true, message = '' }) {
    user && (this.$user.value = user)
    repo && (this.$repo.value = repo)

    this.$icon.classList.remove(ok ? 'ko' : 'ok')
    this.$icon.classList.add   (ok ? 'ok' : 'ko')

    this.$message.textContent = message

    return this
  }
}

window.Git = Git
