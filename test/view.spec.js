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
})
