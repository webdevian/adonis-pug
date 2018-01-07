'use strict'

/*
 * adonis-framework
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

module.exports = function (View, Route, Config) {
  /**
   * Return url for the route
   */
  View.global('route', (...args) => Route.url(...args))

  /**
   * Make url for the assets file
   */
  View.global('assetsUrl', (url) => url && /^\/|^http(s)?/.test(url) ? url : `/${url}`)

  /**
   * Make link tag for css
   */
  View.global('css', function (url, skipSuffix = false) {
    url = !url.endsWith('.css') && !skipSuffix ? `${url}.css` : url
    return `<link rel="stylesheet" href="${this.globals.assetsUrl(url)}" />`
  })

  /**
   * Make script tag for javascript
   */
  View.global('script', function (url, skipSuffix = false) {
    url = !url.endsWith('.js') && !skipSuffix ? `${url}.js` : url
    return `<script type="text/javascript" src="${this.globals.assetsUrl(url)}"></script>`
  })
}
