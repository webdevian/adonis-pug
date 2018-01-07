'use strict'

const pug = require('pug')
const AdonisView = require('@adonisjs/framework/src/View')
const Template = require('../Template')

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
    return new Template(this.engine, this.viewsPath, this.options, this.globals)
  }

  global (key, value) {
    this.globals[key] = value
  }
}

module.exports = View
