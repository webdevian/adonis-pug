const pug = require('pug')
const Helpers = use('Helpers')

/**
 * Provider for pug template rendering
 * @class
 */
class Pug {

  constructor (Config) {
    this.config = Config

    // Warn if basedir is not set in config
    if (!Config.get('app.pug.basedir')) {
      console.warn('Pug views directory (config/app.js - pug.basedir) not set, defaulting to "resources/views"')
    }

    // Prepend adonis root to basedir
    this.viewsPath = Helpers.basePath() + '/' + (Config.get('app.pug.basedir') || 'resources/views')

    // Create options array
    this.options = {
      basedir: this.viewsPath,
      pretty: Config.get('app.pug.pretty') || false,
      cache: Config.get('app.pug.cache') || false,
      doctype: Config.get('app.pug.doctype') || undefined,
      filters: Config.get('app.pug.filters') || undefined,
      self: Config.get('app.pug.self') || false,
      debug: Config.get('app.pug.debug') || false
    }

    // Inject globals from config
    const globals = Config.get('app.pug.globals', {})
    this.options = Object.assign(this.options, globals)

    // Pass Config.get function to globals
    this.options.config = (key, defaultValue) => Config.get(key, defaultValue)
  }

  /**
  * Render a pug template
  *
  * @param  {String}  template  The name of the template file
  * @param  {Object}  options   Pug options / data
  * @return {String}
  *
  * @example
  * Pug.render('myTemplate', { pretty: true }) // returns rendered html for myTemplate.pug, with pretty printing
  *
  * @public
  */
  render (template, options) {
    return pug.renderFile(this.viewsPath + '/' + template + '.pug', this._mergeOptions(options))
  }

  /**
   * Generator alias for render
   *
   * @param  {String}  template  The name of the template file
   * @param  {Object}  options   Pug options / data
   * @return {String}
   */
  * make (template, options) {
    return this.render(template, options)
  }

  /**
  * Render a pug string
  *
  * @param  {String}  string    A pug string
  * @param  {Object}  options   Pug options / data
  * @return {String}
  *
  * @example
  * Pug.renderString('p Hello World') // returnss '<p>Hello World</p>'
  *
  * @public
  */
  renderString (string, options) {
    return pug.render(string, this._mergeOptions(options))
  }

  /**
   * Merge given options with options from Config
   *
   * @param {Object} options  Pug options / data
   * @return {Object}
   *
   * @private
   */
  _mergeOptions (options) {
    // If options are given, merge them with the config options
    // Otherwise, just use the config options
    if (options) {
      Object.assign(options, this.options)
    } else {
      options = this.options
    }
    return options
  }
}

module.exports = Pug
