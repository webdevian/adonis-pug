'use strict'

const chai = require('chai')
const path = require('path')
const expect = chai.expect

const View = require('../src/View')
const Globals = require('../src/View/globals')
const { Helpers, Config } = require('@adonisjs/sink')

let view
let template

describe('Globals', () => {
  beforeEach(() => {
    view = new View(new Helpers(path.join(__dirname, './')), new Config())

    Globals(view, {}, new Config())

    template = view.new()
  })

  it('Globals are bound to the template context', () => {
    view.global('myFunc', function () {
      expect(this.engine.name).to.equal('Pug')
      return true
    })

    template = view.new()

    expect(template.globals).to.be.an('object')
    expect(template.globals.myFunc).to.be.a('function')
    expect(template.globals.myFunc()).to.equal(true)
  })

  it('Route method returns route Url', () => {
    Globals(view, { url: arg => {
      expect(arg).to.equal('someArg')
      return true
    }}, new Config())

    template = view.new()

    expect(template.globals.route).to.be.a('function')
    expect(template.globals.route('someArg')).to.equal(true)
  })

  it('AssetsUrl method returns relative url', () => {
    template = view.new()

    expect(template.globals.assetsUrl).to.be.a('function')
    expect(template.globals.assetsUrl('style.js')).to.equal('/style.js')
  })

  it('AssetsUrl method returns absolute url', () => {
    template = view.new()

    expect(template.globals.assetsUrl).to.be.a('function')
    expect(template.globals.assetsUrl('http://mysite.com/style.js')).to.equal('http://mysite.com/style.js')
  })

  it('css method returns css link tag', () => {
    template = view.new()

    expect(template.globals.css).to.be.a('function')
    expect(template.globals.css('style.css')).to.equal('<link rel="stylesheet" href="/style.css" />')
  })

  it('css method adds css suffix', () => {
    template = view.new()

    expect(template.globals.css).to.be.a('function')
    expect(template.globals.css('style')).to.equal('<link rel="stylesheet" href="/style.css" />')
  })

  it('css method doesn\'t add css suffix if flag set', () => {
    template = view.new()

    expect(template.globals.css).to.be.a('function')
    expect(template.globals.css('style', true)).to.equal('<link rel="stylesheet" href="/style" />')
  })

  it('style method returns css link tag', () => {
    template = view.new()

    expect(template.globals.style).to.be.a('function')
    expect(template.globals.style('style.css')).to.equal('<link rel="stylesheet" href="/style.css" />')
  })

  it('style method adds css suffix', () => {
    template = view.new()

    expect(template.globals.style).to.be.a('function')
    expect(template.globals.style('style')).to.equal('<link rel="stylesheet" href="/style.css" />')
  })

  it('style method doesn\'t add css suffix if flag set', () => {
    template = view.new()

    expect(template.globals.style).to.be.a('function')
    expect(template.globals.style('style', true)).to.equal('<link rel="stylesheet" href="/style" />')
  })

  it('script method returns script tag', () => {
    template = view.new()

    expect(template.globals.script).to.be.a('function')
    expect(template.globals.script('style')).to.equal('<script type="text/javascript" src="/style.js"></script>')
  })

  it('script method adds js suffix', () => {
    template = view.new()

    expect(template.globals.script).to.be.a('function')
    expect(template.globals.script('style')).to.equal('<script type="text/javascript" src="/style.js"></script>')
  })

  it('script method doesn\'t add js suffix if flag set', () => {
    template = view.new()

    expect(template.globals.script).to.be.a('function')
    expect(template.globals.script('style', true)).to.equal('<script type="text/javascript" src="/style"></script>')
  })
})
