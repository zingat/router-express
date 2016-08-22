# router-express <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/yasinaydin/router-express/badge.svg?branch=master)](https://coveralls.io/github/yasinaydin/router-express?branch=master)
[![dependency status][deps-svg]][deps-url]
[![Code Climate](https://codeclimate.com/github/yasinaydin/router-express/badges/gpa.svg)](https://codeclimate.com/github/yasinaydin/router-express)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c2c014171cc8417eba0239160af12ad9)](https://www.codacy.com/app/yasin/router-express?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yasinaydin/router-express&amp;utm_campaign=Badge_Grade)

```js
var express = require('express')
var routerExpress = require('router-express')

var app = express()

var routes = [
  {
    name: 'homepage',
    method: 'get',
    url: '/',
    module: 'static/home'
  }
]

global.Router = new routerExpress(routes)
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
[npm-version-svg]: https://img.shields.io/npm/v/router-express.svg
[npm-url]: https://npmjs.org/package/router-express
[travis-image]: https://img.shields.io/travis/yasinaydin/router-express/master.svg
[travis-url]: https://travis-ci.org/yasinaydin/router-express
