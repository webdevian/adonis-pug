'use strict'

const path = require('path')

class Template {
  constructor (engine, viewsPath, options, globals) {
    this.engine = engine
    this.viewsPath = viewsPath
    this.options = options
    this.globals = globals

    Object.keys(this.globals).map(key => {
      const value = this.globals[key]
      if (typeof value === 'function') {
        this.globals[key] = value.bind(this)
      }
    })

    this.locals = {}
  }

  share (obj) {
    Object.keys(obj).map(key => {
      if (typeof obj[key] === 'function') {
        obj[key] = obj[key].bind(this)
      }
      this.locals[key] = obj[key]
    })
    return this
  }

  render (template, locals) {
    if (locals) {
      this.share(locals)
    }

    template = template.replace('.', path.sep)

    return this.engine.renderFile(path.join(this.viewsPath, `${template}.pug`), this._getOptions())
  }

  renderString (string, locals) {
    if (locals) {
      this.share(locals)
    }

    return this.engine.render(string, this._getOptions())
  }

  _getOptions () {
    return Object.assign(this.locals, Object.assign(this.options, this.globals))
  }
}

module.exports = Template
