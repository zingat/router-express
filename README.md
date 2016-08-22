# router-express <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![Build Status][travis-image]][travis-url] 
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c2c014171cc8417eba0239160af12ad9)](https://www.codacy.com/app/yasin/router-express?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yasinaydin/router-express&amp;utm_campaign=Badge_Grade)

[![npm badge][npm-badge-png]][npm-url]

Yet another routing for Express.

### Features

* Name-based routing
* Reverse routing
* Parameter injection and default parameters
* HTTP methods support

### Install

```sh
npm install router-express
```

### Basic usage

```js
// Define app
var express = require('express');
var app = express();

// Define routes
var routes = [{
    name: 'homepage',
    url: '/',
    action: 'home',
}];

// Define actions
var actions = {
    home: function (request, response) {
      res.end('Welcome to homepage with router-express');
    }
};

// Initialize router
var routerexpress = require('router-express');
var router = new routerexpress(routes, actions);

// Apply route
router.apply(app);
```

### Advanced features

* [Creating URLs](https://github.com/yasinaydin/router-express/wiki/createurl)
* [Updating URLs](https://github.com/yasinaydin/router-express/wiki/updateurl)
* [Getting parameters](https://github.com/yasinaydin/router-express/wiki/getparams)
* [Limiting parameters](https://github.com/yasinaydin/router-express/wiki/limitparams)


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

