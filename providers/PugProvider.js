'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

/**
 * Provider for pug template rendering
 * @class
 * @extends ServiceProvider
 */
class PugProvider extends ServiceProvider {

  * register () {
    this.app.bind('Adonis/Addons/Pug', function (app) {
      const Config = app.use('Adonis/Src/Config')
      const Pug = require('../src/Pug')
      const pug = new Pug(Config)

      // Extend response with pug method
      const Response = app.use('Adonis/Src/Response')
      Response.macro('pug', function (template, options) {
        return this.send(pug.render(template, options))
      })

      return pug
    })
  }
}

module.exports = PugProvider
