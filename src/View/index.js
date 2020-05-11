'use strict'

const pug = require('pug')
const AdonisView = require('@adonisjs/framework/src/View')
const Template = require('../Template')

/**
 * @class View
 * @extends AdonisView
 */
class View extends AdonisView {
  /**
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
      compileDebug: !!Config.get('pug.compileDebug') || false,
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
   * Share variables as a local with this template context
   *
   * @param  {Object} locals Key value pairs
   * @return {Template}      New template instance with locals setup
   */
  share (...args) {
    const template = this.new()
    template.share(...args)
    return template
  }

  /**
   * Render a pug template
   * @param  {String} template View file (.pug extension not required)
   * @param  {Object} locals   Variables to be passed to the view
   * @return {String}          HTML rendered output
   */
  render (...args) {
    return this.new().render(...args)
  }

  /**
   * Render a string of pug
   * @param  {String} string String to be rendered
   * @param  {Object} locals Variables to be passed to the view
   * @return {String}        HTML rendered output
   */
  renderString (...args) {
    return this.new().renderString(...args)
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
