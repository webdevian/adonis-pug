'use strict'

const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const path = require('path')

const MakePug = require('../src/Commands/Pug')

let makePug
let generateFileStub
let consoleStub
let existsStub

describe('Make Pug view command', () => {
  beforeEach(() => {
    makePug = new MakePug()

    existsStub = sinon.stub(makePug, 'pathExists').returns(true)
    generateFileStub = sinon.stub(makePug, 'generateFile').resolves(true)

    consoleStub = sinon.stub(console, 'info')
  })

  afterEach(() => {
    generateFileStub.restore()
    consoleStub.restore()
  })

  it('Has a signature and description', () => {
    expect(MakePug.signature).to.be.a('string')
    expect(MakePug.description).to.be.a('string')
  })

  it('Generate test.pug in resources/views', async () => {
    const handle = await makePug.handle({name: 'test'}, {})

    expect(handle).to.equal('resources/views/test.pug')
    expect(generateFileStub).to.be.calledWith(path.join(__dirname, '../resources/views/test.pug'))
    expect(consoleStub).to.be.calledWith('✔ create  resources/views/test.pug')
  })

  it('Generate test.pug in resources/views with a layout', async () => {
    const handle = await makePug.handle({name: 'extender'}, {layout: 'layout.pug'})

    expect(handle).to.equal('resources/views/extender.pug')
    expect(generateFileStub).to.be.calledWith(path.join(__dirname, '../resources/views/extender.pug'))
    expect(consoleStub).to.be.calledWith('✔ create  resources/views/extender.pug')
  })

  it('Handles error ', async () => {
    existsStub.restore()
    existsStub = sinon.stub(makePug, 'pathExists').returns(false)

    const errorStub = sinon.stub(makePug, 'error')

    const handle = await makePug.handle({name: 'extender'}, {layout: 'layout.pug'})

    expect(handle).to.equal(undefined)
    expect(errorStub).to.be.calledWith('Make sure you are inside an Adonisjs app to run the make pug command')

    errorStub.restore()
  })
})
