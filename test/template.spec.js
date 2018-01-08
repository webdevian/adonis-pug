'use strict'

const chai = require('chai')
const path = require('path')
const expect = chai.expect

const View = require('../src/View')
const Template = require('../src/Template')
const Globals = require('../src/View/globals')
const { Helpers, Config } = require('@adonisjs/sink')

let view
let template

describe('Template class', () => {
  beforeEach(() => {
    view = new View(new Helpers(path.join(__dirname, './')), new Config())

    Globals(view, {}, new Config())

    template = view.new()
  })

  it('Globals are bound to the template context', () => {
    const myFunc = function () {
      expect(this.engine.name).to.equal('Pug')
      return true
    }

    template = new Template(view.engine, '', {}, { myString: 'string', myFunc })

    expect(template.globals).to.be.an('object')
    expect(template.globals.myFunc).to.be.a('function')
    expect(template.globals.myFunc()).to.equal(true)
  })

  it('Share method adds to locals', () => {
    template = new Template(view.engine, '', {}, {})
    template.share({myKey: 'some-string'})

    expect(template.locals).to.be.an('object')
    expect(template.locals.myKey).to.equal('some-string')
  })

  it('Share method adds to locals', () => {
    const myFunc = function () {
      expect(this.engine.name).to.equal('Pug')
      return true
    }

    template = new Template(view.engine, '', {}, {})

    template.share({'myFunc': myFunc})

    expect(template.locals).to.be.an('object')
    expect(template.locals.myFunc).to.be.a('function')
    expect(template.locals.myFunc()).to.equal(true)
  })

  it('Render a string of pug', () => {
    template = new Template(view.engine, '', {}, {})

    expect(template.renderString('a(title="my-link") link')).to.equal('<a title="my-link">link</a>')
  })

  it('Render a string of pug with shared data', () => {
    template = new Template(view.engine, '', {}, {})
    template.share({myKey: 'some-string'})

    expect(template.renderString('a(title=myKey) link')).to.equal('<a title="some-string">link</a>')
  })

  it('Render a string of pug with passed data', () => {
    template = new Template(view.engine, '', {}, {})

    expect(template.renderString('a(title=myKey) link', {myKey: 'some-string'})).to.equal('<a title="some-string">link</a>')
  })

  it('Render a string of pug with a global', () => {
    expect(template.renderString('a(title="my-link", href=assetsUrl("style.css")) link')).to.equal('<a title="my-link" href="/style.css">link</a>')
  })

  it('Render a pug template', () => {
    expect(template.render('basic')).to.equal('<a title="my-link">link</a>')
  })

  it('Rendered templates are cached', () => {
    const config = new Config()
    config.set('pug.cache', true)
    view = new View(new Helpers(path.join(__dirname, './')), config)
    template = view.new()

    expect(template.engine.cache[template.viewsPath + '/basic.pug']).to.equal(undefined)
    template.render('basic')

    expect(template.engine.cache[template.viewsPath + '/basic.pug']).to.be.a('function')
  })

  it('Render a pug template with dot notation', () => {
    expect(template.render('subdir.template')).to.equal('<h1>In a subdirectory</h1>')
  })

  it('Render a pug template with given locals', () => {
    expect(template.render('locals', {myKey: 'some-string'})).to.equal('<a title="some-string">link</a>')
  })
})
