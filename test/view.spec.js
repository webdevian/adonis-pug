'use strict'

const chai = require('chai')
const path = require('path')
const expect = chai.expect

const View = require('../src/View')
const { Helpers, Config } = require('@adonisjs/sink')

describe('View Class', () => {
  it('View has pug rendering engine', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.engine.name).to.equal('Pug')
  })

  it('Add a global value', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.globals.myValue).to.equal(undefined)

    view.global('myValue', 'a-string')

    expect(view.globals.myValue).to.equal('a-string')
  })

  it('Return a new template', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.new()).to.be.an('object')
    expect(view.new().engine).to.equal(view.engine)
  })

  it('Options set in config are sent to pug', () => {
    const config = new Config()

    config.set('pug.pretty', true)
    config.set('pug.cache', 1)
    config.set('pug.doctype', 'strict')
    config.set('pug.filters', {myFilter: text => text.toUpperCase()})
    config.set('pug.self', 'yes')
    config.set('pug.debug', true)

    const view = new View(new Helpers(path.join(__dirname, './')), config)

    expect(view.options.pretty).to.equal(true)
    expect(view.options.cache).to.equal(true)
    expect(view.options.doctype).to.equal('strict')
    expect(view.options.filters.myFilter).to.be.a('function')
    expect(view.options.self).to.equal(true)
    expect(view.options.debug).to.equal(true)
  })
})
