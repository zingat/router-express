# router-express

[![Version Badge][npm-version-svg]][npm-url]
[![Build Status][travis-image]][travis-url] 
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]

[![npm badge][npm-badge-png]][npm-url]

```js
var express = require('express')
var router-express = require('router-express')

var app = express()

var routes = [
  {
    name: 'homepage',
    method: 'get',
    url: '/',
    module: 'static',
    action: 'home'
  }
]

var Router = new router-express(routes, './modules')
Router.bind(app)
```

### Install
```sh
npm install router-express
```

### Features

* Name-based routing
* Reverse routing
* Parameter injection and default parameters
* HTTP methods support



[deps-svg]: http://david-dm.org/yasinaydin/router-express/status.svg
[deps-url]: http://david-dm.org/yasinaydin/router-express
[dev-deps-svg]: https://david-dm.org/yasinaydin/router-express/dev-status.svg
[dev-deps-url]: https://david-dm.org/yasinaydin/router-express#info=devDependencies
[downloads-image]: http://img.shields.io/npm/dm/router-express.svg
[downloads-url]: http://npm-stat.com/charts.html?package=router-express
[downloads-total-image]: https://img.shields.io/npm/dt/router-express.svg?maxAge=2592000
[license-image]: http://img.shields.io/npm/l/router-express.svg
[license-url]: LICENSE
[npm-badge-png]: https://nodei.co/npm/router-express.png?downloads=true&stars=true
[npm-version-svg]: https://img.shields.io/npm/v/router-express.svg
[npm-url]: https://npmjs.org/package/router-express
[travis-image]: https://img.shields.io/travis/yasinaydin/router-express/master.svg
[travis-url]: https://travis-ci.org/yasinaydin/router-express

