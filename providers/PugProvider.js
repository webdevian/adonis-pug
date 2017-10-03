'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

/**
 * Provider for pug template rendering
 * @class
 * @extends ServiceProvider
 */
class PugProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Addons/Pug', function (app) {
      const Config = app.use('Adonis/Src/Config')
      const Pug = require('../src/Pug')
      const pug = new Pug(Config)

      // Extend response with pug method
      const Response = app.use('Adonis/Src/Response')
      Response.macro('pug', function (template, options = {}) {
        // Inject flashMessages (from flash middleware)
        if (this.request._flashMessages) {
          options.flashMessages = this.request._flashMessages.getValues
        }

        // Inject Current User
        if (this.request.currentUser) {
          options.currentUser = this.request.currentUser
        }

        // Inject old method (from flash middleware)
        if (typeof this.request.old === 'function') {
          options.old = (key, defaultValue) => this.request.old(key, defaultValue)
        }

        // Inject cspNonce (from shield middleware)
        if (typeof this.request.nonce === 'function' && this.request.nonce()) {
          options.cspNonce = this.request.nonce()
        }

        // Inject cspNonce (from shield middleware)
        if (typeof this.request.csrfToken === 'function' && this.request.csrfToken()) {
          options.csrfToken = this.request.csrfToken()
        }

        // Inject this.request.input()
        if (typeof this.request.input === 'function') {
          options.input = (key, defaultValue) => this.request.input(key, defaultValue)
        }

        const requestInjectors = Config.get('pug.requestInject', {})

        Object.keys(requestInjectors).forEach(injector => {
          if (this.request[injector]) {
            options[requestInjectors[injector]] = this.request[injector]
          }
        })

        return this.send(pug.render(template, options))
      })

      return pug
    })

    this.app.alias('Adonis/Addons/Pug', 'Pug')

    // Extend Mail with PugMail. If adonis-mail-provider is not installed it will fail silently
    this.app.singleton('Adonis/Addons/PugMail', function (app) {
      const Helpers = use('Adonis/Src/Helpers')
      try {
        const MailManager = require(Helpers._appRoot + '/node_modules/@adonisjs/mail/src/Mail/Manager')

        const Pug = app.use('Adonis/Addons/Pug')
        const Config = app.use('Adonis/Src/Config')
        return new MailManager(Pug, Config)
      } catch (e) {
        return false
      }
    })

    this.app.alias('Adonis/Addons/PugMail', 'Mail')
  }
}

module.exports = PugProvider
