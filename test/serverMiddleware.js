var express = require('express')
var path = require('path')
var routerExpress = require('../lib/index')

var app = express()

var routes = [
  {
    name: 'homepage',
    url: '/',
    module: 'static/home' // @TODO: xx/yy moduel == name,
    // name = alias || name || module
  }
]

var middleware = function (req, res) {
  return res.end('MID-STOP')
}

var Router = new routerExpress(routes)
Router.bind(app, middleware)

var server = app.listen(3000)

module.exports = server
