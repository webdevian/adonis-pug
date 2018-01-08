'use strict'

const pug = require('pug')
const AdonisView = require('@adonisjs/framework/src/View')
const Template = require('../Template')

class View extends AdonisView {
  /**
   * @class View
   * @constructor
   *
   * @param  {Object} Helpers Adonis Helpers instance
   * @param  {Object} Config  Adonis Config instance
   * @return {void}
   */
  constructor (Helpers, Config) {
    super(Helpers)

    this.viewsPath = Helpers.viewsPath()

    this.options = {
      basedir: this.viewsPath,
      pretty: !!Config.get('pug.pretty') || false,
      cache: !!Config.get('pug.cache') || false,
      doctype: Config.get('pug.doctype') || undefined,
      filters: Config.get('pug.filters') || {},
      self: !!Config.get('pug.self') || false,
      debug: !!Config.get('pug.debug') || false
    }

    this.globals = {}

    this.engine = pug
  }

  /**
   * Create new template instance
   * @return {Template}
   */
  new () {
    return new Template(this.engine, this.viewsPath, this.options, this.globals)
  }

  /**
   * Add a global variable
   * @param  {String} key  Variable name
   * @param  {Mixed} value Contents of variable
   * @return {void}
   */
  global (key, value) {
    this.globals[key] = value
  }
}

module.exports = View
