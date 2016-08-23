var express = require('express')
var path = require('path')
var routerExpress = require('../lib/index')

var app = express()

var routes = [
  {
    name: 'route1',
    url: '/',
    module: 'route/one',
    order: 2
  },
  {
    name: 'route2',
    url: '/',
    module: 'route/two',
    order: 1
  }
]

var Router = new routerExpress(routes, path.join(__dirname, './actions'))
Router.bind(app)

var server = app.listen(3000)

module.exports = server
