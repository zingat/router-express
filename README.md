# router-express <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

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

[npm-version-svg]: http://vb.teelaun.ch/yasinaydin/router-express.svg
