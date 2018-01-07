'use strict'

const AdonisViewProvider = require('@adonisjs/framework/providers/ViewProvider.js')

class ViewProvider extends AdonisViewProvider {
  /**
   * Register method called by the Ioc container
   * to register the provider
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Src/View', (app) => {
      const Helpers = app.use('Adonis/Src/Helpers')
      const Config = app.use('Adonis/Src/Config')

      const View = require('../src/View')
      return new View(Helpers, Config)
    })
    this.app.alias('Adonis/Src/View', 'View')
  }

  /**
   * Boot method called by the Ioc container to
   * boot the provider
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Context = this.app.use('Adonis/Src/HttpContext')
    const View = this.app.use('Adonis/Src/View')
    const Config = this.app.use('Adonis/Src/Config')
    const Route = this.app.use('Adonis/Src/Route')

    /**
     * Registering wildely available globals
     */
    require('../src/View/globals')(View, Route, Config)

    /**
     * Registers an isolated instance of view on the
     * context object.
     */
    Context.getter('view', function () {
      return View.new()
    }, true)
  }
}

module.exports = ViewProvider
