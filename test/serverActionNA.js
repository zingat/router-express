var express = require('express')
var path = require('path')
var routerExpress = require('../lib/index')

var app = express()

var routes = [
  {
    name: 'homepage',
    url: '/',
    module: 'static/error'
  }
]

var Router = new routerExpress(routes, path.join(__dirname, './actions'))
Router.bind(app)

var server = app.listen(3000)

module.exports = server
