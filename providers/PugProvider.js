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

    // Extend Mail with PugMail. If adonis-mail-provider is not install it will fail silently
    this.app.singleton('Adonis/Addons/PugMail', function (app) {
      const Helpers = use('Adonis/Src/Helpers')
      try {
        const MailManager = require(Helpers.basePath() + '/node_modules/adonis-mail-provider/src/Mail/MailManager')

        const Pug = app.use('Adonis/Addons/Pug')
        const Config = app.use('Adonis/Src/Config')
        return new MailManager(Pug, Config)
      } catch (e) {
        return false
      }
    })
  }
}

module.exports = PugProvider
