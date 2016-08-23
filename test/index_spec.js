var assert = require('assert')
var express = require('express')
var path = require('path')
var request = require('supertest')
var RouterExpress = require('../lib/index')

// Successful Inits

describe('Spec::Init', function () {

  describe('Default configuration', function () {
    var server
    before(function () { server = require('./serverDefault') })
    after(function () { server.close() })

    it('should run', function (done) {
       request(server)
        .get('/')
        .expect(200, 'HOMEPAGE_DEFAULT_CONFIG', done)
    })
  })

  describe('Custom modules dir', function () {
    var server
    before(function () { server = require('./serverModuleDir') })
    after(function () { server.close() })

    it('should run', function (done) {
       request(server)
        .get('/')
        .expect(200, 'HOMEPAGE_MODULEDIR', done)
    })
  })

  describe('Middleware', function () {
    var server
    before(function () { server = require('./serverMiddleware') })
    after(function () { server.close() })

    it('should run', function (done) {
      request(server)
        .get('/')
        .expect(200, 'MID-STOP', done)
    })
  })

  describe('Ordered routes', function () {
    var server
    before(function () { server = require('./serverOrderedRoutes') })
    after(function () { server.close() })

    it('should run', function (done) {
      request(server).get('/').expect(200, 'ORDER_TWO', done)
    })
  })
})

// Init errors

describe('Spec::Init errors', function () {
  describe('route.nodule/route.actionFile not defined', function () {
    it('should NOT run', function () {
      assert.throws(
        function () { require('./serverActionless') },
        /route.module not defined for: homepage/
      )
    })
  })

  describe('route.url/route.regexUrl not defined', function () {
    it('should NOT run', function () {
      assert.throws(
        function () { require('./serverUrlless') },
        /route.url missing for: homepage/
      )
    })
  })

  describe('Custom modules dir', function () {
    var server
    before(function () { server = require('./serverActionNA') })
    after(function () { server.close() })

    it('should NOT run', function (done) {
      request(server).get('/').expect(500, done)
    })
  })
})



describe('Spec::url operations', function () {
  var route = {
    name: 'homepage',
    url: '/',
    module: 'static/home'
  }
  var routes = [route]

  var app = express()
  var Router = new RouterExpress(routes, path.join(__dirname, './actions'))
  Router.bind(app)

  describe('Router.createUrl', function () {
    it('should create a url with no parameters', function () {
      assert.strictEqual(Router.createUrl('homepage'), '/')
    })

    it('should NOT work for undefined routes', function () {
      assert.throws(
        function () {
          Router.createUrl('nonExistingPage')
        },
        /Error: createUrl failed. routeName=nonExistingPage params=undefined/
      )
    })
  })

  // createUrlQuery

  describe('Router.updateUrlWithParam', function () {
    it('should update some url', function () {
      assert.strictEqual(Router.updateUrlWithParam('/', 'foo', 'bar', route), '/?foo=bar')
    })

    it('should update with params array', function () {
      assert.strictEqual(Router.updateUrlWithParam('/', ['foo', 'bar'], 'baz', route), '/?foo=baz&bar=baz')
    })
  })
})
