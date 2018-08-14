class Git {
  constructor({ $form }) {
    this.$form       = $form
    this.$dispatcher = this.$form

    this.onForm = this.onForm.bind(this)
  }

  attach() {
    this.$github  = this.$form.querySelector('.github')
    this.$local   = this.$form.querySelector('.local')
    this.$user    = this.$form.querySelector('.user')
    this.$repo    = this.$form.querySelector('.repo')
    this.$icon    = this.$form.querySelector('.icon')
    this.$message = this.$form.querySelector('.message')
    this.$url     = this.$form.querySelector('.url')

    this.$form  .addEventListener('submit', this.onForm)
    this.$github.addEventListener('change', this.onForm)
    this.$local .addEventListener('change', this.onForm)

    return this
  }

  detach() {
                    this.$form  .removeEventListener('submit', this.onForm)
    this.$github && this.$github.removeEventListener('change', this.onForm)
    this.$local  && this.$local .removeEventListener('change', this.onForm)

    return this
  }

  onForm(e) {
    const local = this.$local.checked
    const user  = this.$user .value
    const repo  = this.$repo .value
    const url   = this.$url  .value

    this.$dispatcher.dispatchEvent(
      new CustomEvent('git:form', {
        detail: { local, user, repo, url }
      })
    )

    e.preventDefault()
    e.stopPropagation()

    return this
  }

  render({ local, user, repo, url, error }) {
    this.detach()
      .rememberFocus()

    this.$form.innerHTML = `
      <label>
          <input class="github" type="radio" name="local" value="0" ${ local ? '' : 'checked="true"' }>
          <b>Github</b>
      </label>
      <input class="user" type="text" placeholder="user" value="${ user }">/
      <input class="repo" type="text" placeholder="repo" value="${ repo }">
      <br>
      <label>
          <input class="local" type="radio" name="local" value="1" ${ local ? 'checked="true"' : '' }">
          <b>Local</b>
      </label>
      <input class="url" type="text" placeholder="URL" value="${ url }">
      <i class="icon ${ error ? 'ko' : 'ok' }"></i>
      <span class="message">${ error || '' }</span>
      <input type="submit" style="display:none" />
    `

    this.attach()
      .restoreFocus()

    return this
  }

  rememberFocus() {
    const $el = document.activeElement

    this._focused = {
      value             : $el && $el.classList.value,
      selectionStart    : $el && $el.selectionStart,
      selectionEnd      : $el && $el.selectionEnd,
      selectionDirection: $el && $el.selectionDirection
    }

    return this
  }

  restoreFocus() {
    let $el = null

    switch (this._focused.value) {
      case 'user':
        $el = this.$user
        break
      case 'repo':
        $el = this.$repo
        break
      case 'url':
        $el = this.$url
        break
    }

    if ($el) {
      $el.focus()
      $el.selectionStart     = this._focused.selectionStart
      $el.selectionEnd       = this._focused.selectionEnd
      $el.selectionDirection = this._focused.selectionDirection
    }

    this._focused = {}

    return this
  }
}

window.Git = Git
