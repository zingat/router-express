yet-another-express-routing
===========================
> Advanced routing for Express

This library provides advanced routing features for ExpressJS apps.

### Features
* Resource routing and shared routes
* Reverse routing
* HTTP method, url params, default parameters in route configuration

### Install
```SH
npm install yet-another-express-router
```

### Using

You need to define routes and controllers objects first.
```js

var routes = [
  {
    name: 'homepage',
    url: '/',
    action: 'home',
  }
];
var controllers = {};
controllers.home = function (request, response) {
  res.end('Welcome to homepage with YaeRouter');
}
```

After that you should initialize router with these.
```js
var express = require('express');
var app = express();

var yaer = require('yet-another-express-router')
var router = new yaer(routes, controllers)
router.Apply(app);
```

You are initially done! Now when you access `/`,  `controllers.home` will answer the request.

### Create URL for a route
To create a basic url, provide the `router.name`:
```js
var homepageUrl = router.CreateUrl('home'); // Creates '/'
```

To create a url with parameters, provide parameters:
```js
var homepageUrlWithParams = router.CreateUrl('home', {lang:'en'}); // Creates '/?lang=en'
```

To create a url with parameters inside the url, first define a route with parameters:
```js
routes = [
  {
    name: 'projectDetails',
    url: '/project/:id',
    action: 'projectDetailsPageAction'
  }
  ...
];
var projectId = 7;
var projectDetailsUrl = router.CreateUrl('projectDetails', {id: projectId}); // Creates `/project/7`
```

Or you can use multiple parameters. URL parameters will be decided by route.url and route.params:
```js
var projectDetailsUrl2 = router.CreateUrl('projectDetails', {id: projectId, lang: 'en'} // Creates `/project/7?lang=en
```

### Update URL with parameter
In a case where you have to update the url with a filter, i.e. pagination, you can use `UpdateUrlWithParam`.
```js
var baseUrl = request.url;
var pageNumber; //ie: 3
var paginationUrl = router.UpdateUrlWithParam(baseUrl, page, 3); // Creates /..(current url)..?page=3
```

`UpdateUrlWithParam` always updates the url with given parameter. If no value is specified, the parameter is removed from the url.
```js
var baseUrl = '/project/search?page=3`;
var newUrl = router.UpdateUrlWithParam(baseUrl, page); // baseUrl = /project/search
```

