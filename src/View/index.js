'use strict'

const AdonisView = require('@adonisjs/framework/src/View')
const pug = require('pug')

class Template {
  constructor (viewsPath = {}, options = {}, globals = {}) {
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

  render (template) {
    return pug.renderFile(this.viewsPath + '/' + template + '.pug', this._getOptions())
  }

  renderString (string, options) {
    return pug.render(string, this._getOptions())
  }

  _getOptions () {
    return Object.assign(this.locals, Object.assign(this.options, this.globals))
  }

  safe (string) {
    return string
  }
}

class View extends AdonisView {
  constructor (Helpers, Config) {
    super(Helpers)

    this.viewsPath = Helpers.viewsPath()

    this.options = {
      basedir: this.viewsPath,
      pretty: Config.get('pug.pretty') || false,
      cache: Config.get('pug.cache') || false,
      doctype: Config.get('pug.doctype') || undefined,
      filters: Config.get('pug.filters') || undefined,
      self: Config.get('pug.self') || false,
      debug: Config.get('pug.debug') || false
    }

    this.globals = {}

    this.engine = pug
  }

  new () {
    return new Template(this.viewsPath, this.options, this.globals)
  }

  global (key, value) {
    this.globals[key] = value
  }

  share (obj) {
    return this.new().share(obj)
  }

  render (template) {
  }
}

module.exports = View
