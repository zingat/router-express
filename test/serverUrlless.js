var express = require('express')
var path = require('path')
var routerExpress = require('../lib/index')

var app = express()

var routes = [
  {
    name: 'homepage',
    module: 'static/home'
  }
]

var Router = new routerExpress(routes)
Router.bind(app)

var server = app.listen(3000)

module.exports = server
