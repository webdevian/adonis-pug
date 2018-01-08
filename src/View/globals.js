'use strict'

/**
 * Add a filetyp suffix to a url
 * @param  {String} url         Original Url
 * @param  {String} suffix      Filename suffix
 * @param  {Boolean} skipSuffix Should we just ignore missing suffix
 * @return {String}             New Url
 */
const appendToUrl = (url, suffix, skipSuffix) => {
  return !url.endsWith(`.${suffix}`) && !skipSuffix ? `${url}.${suffix}` : url
}

module.exports = function (View, Route, Config) {
  /**
   * Return url for the route
   *
   * @param {Mixed} args Arguments passed to Route url method
   * @return {String}
   */
  View.global('route', (...args) => Route.url(...args))

  /**
   * Make url for the assets file
   *
   * @param {String} url Relative or absolute url
   * @return {String}   Url to asset
   */
  View.global('assetsUrl', (url) => url && /^\/|^http(s)?/.test(url) ? url : `/${url}`)

  /**
   * Make link tag for css
   *
   * @param {String}  url                 Filename or url
   * @param {Boolean} [skipSuffix=false]  Don't add css file suffix?
   * @return {String}                    HTML link tag
   */
  View.global('css', function (url, skipSuffix = false) {
    return `<link rel="stylesheet" href="${this.globals.assetsUrl(appendToUrl(url, 'css', skipSuffix))}" />`
  })

  /**
   * Make script tag for javascript
   *
   * @param {String}  url                 Filename or url
   * @param {Boolean} [skipSuffix=false]  Don't add js file suffix?
   * @return {String}                    HTML script tag
   */
  View.global('script', function (url, skipSuffix = false) {
    return `<script type="text/javascript" src="${this.globals.assetsUrl(appendToUrl(url, 'js', skipSuffix))}"></script>`
  })
}
