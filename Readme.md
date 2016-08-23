# router-express <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![dependency status][deps-svg]][deps-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Join the chat at https://gitter.im/router-express/Lobby][gitter-image]][gitter-url]

## Install
```sh
npm install --save router-express
```

## Configure
```js
var express = require('express')
var routerExpress = require('router-express')

var app = express()

var routes = [
  {
    name: 'homepage',
    url: '/',
    module: 'static/home'
  },
  {
    name: 'contact',
    url: '/contact-us',
    module: 'static/contact'
  }
]

global.Router = new RouterExpress(routes)
Router.bind(app)
```

## Modules structure
```
modules/
  static/
    home/
      index.js
    contact/
      index.js
```

## Module file
```js
// modules/static/home/index.js
module.exports = function (req, res) {
  return res.end('Homepage')
}
```

## URL methods
```js
var example = Router.createUrl('contact', {foo: 'bar'}) // -> /contact-us?foo=bar
var another = Router.updateUrlWithParam(example, 'foo', undefined, res.params.route) // -> /contact-us
```

### Features

* Get a route by its name (`route.name`) and access its properties
* Create a url for a route by its name (`route.name`)
* Combine all request parameters to `res.params` container
* Current route is accessible in action middleware via `res.params.route`

* middleware
* auto routes

* Able to create new urls easily
* Name-based routing 
* Reverse routing
* Parameter injection and default parameters
* HTTP methods support

### Default route parameters

```js
{
  actionFile: module, // alias
  modulesDir: path.join(__dirname, 'modules'),
  method: 'get',
  params: {},
  regexUrl: undefined,
  regexParams: undefined
}
```

[codacy-image]: https://api.codacy.com/project/badge/Grade/c2c014171cc8417eba0239160af12ad9
[codacy-url]: https://www.codacy.com/app/yasin/router-express
[codeclimate-image]: https://codeclimate.com/github/yasinaydin/router-express/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/yasinaydin/router-express
[coveralls-image]: https://coveralls.io/repos/github/yasinaydin/router-express/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/yasinaydin/router-express?branch=master
[deps-svg]: http://david-dm.org/yasinaydin/router-express/status.svg
[deps-url]: http://david-dm.org/yasinaydin/router-express
[dev-deps-svg]: https://david-dm.org/yasinaydin/router-express/dev-status.svg
[dev-deps-url]: https://david-dm.org/yasinaydin/router-express#info=devDependencies
[downloads-image]: http://img.shields.io/npm/dm/router-express.svg
[downloads-url]: http://npm-stat.com/charts.html?package=router-express
[gitter-image]: https://badges.gitter.im/router-express/Lobby.svg
[gitter-url]: https://gitter.im/router-express/Lobby
[npm-version-svg]: https://img.shields.io/npm/v/router-express.svg
[npm-url]: https://npmjs.org/package/router-express
[travis-image]: https://img.shields.io/travis/yasinaydin/router-express/master.svg
[travis-url]: https://travis-ci.org/yasinaydin/router-express
