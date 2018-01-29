'use strict'

const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))

const ViewProvider = require('../providers/ViewProvider')

const { registrar, ioc } = require('@adonisjs/fold')
const { Helpers, setupResolver } = require('@adonisjs/sink')
const path = require('path')

const providers = [
  require.resolve('@adonisjs/framework/providers/AppProvider')
]

describe('ViewProvider', () => {
  before(() => {
    process.env.ENV_SILENT = true
    ioc.bind('Adonis/Src/Helpers', () => new Helpers(path.join(__dirname, './')))
    setupResolver()
    return new Promise((resolve, reject) => {
      registrar
        .providers(providers)
        .registerAndBoot()
        .then(() => {
          const Config = use('Config')
          Config.set('app.logger', {
            transport: 'console',
            console: {
              driver: 'console'
            }
          })
          resolve()
        })
        .catch(reject)
    })
  })
  beforeEach(() => {
    ioc.restore()
  })

  it('Singleton class and alias are registered', () => {
    const viewProviderInstance = new ViewProvider(ioc)
    expect(() => { ioc.use('Adonis/Src/View') }).to.throw('Cannot find module \'Adonis/Src/View\'')

    viewProviderInstance.register()

    expect(ioc.use('Adonis/Src/View')).to.be.an('object')
    expect(ioc.use('View')).to.be.an('object')
    expect(ioc.use('View').options).to.be.an('object')
  })

  it('View is added to context', () => {
    const viewProviderInstance = new ViewProvider(ioc)

    const contextSpy = sinon.spy(use('Adonis/Src/HttpContext'), 'getter')
    viewProviderInstance.boot()

    expect(contextSpy).to.be.calledWith('view')
    const contextMethod = contextSpy.lastCall.args[1]
    expect(contextMethod()).to.be.an('object')
    expect(contextMethod().render).to.be.a('function')

    contextSpy.restore()
  })

  it('Globals are added to context Template instance', () => {
    const viewProviderInstance = new ViewProvider(ioc)

    const contextSpy = sinon.spy(use('Adonis/Src/HttpContext'), 'getter')
    viewProviderInstance.boot()

    const contextMethod = contextSpy.lastCall.args[1]
    expect(contextMethod().globals).to.have.keys(['route', 'assetsUrl', 'css', 'script'])

    contextSpy.restore()
  })
})
