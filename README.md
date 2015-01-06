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

### Fetching request and default parameters

Normally, `request.params` or `request.query` will provide request parameters. However, in case you need default route parameters, you can use the `FetchRequestAndDefaultParams` function.
```js
var routes = [
  {
    name: 'routeName',
    url: '/someUrl',
    action: /'someAction',
    params: {
      param1: { default: 81 }
  }];
// When requesting /someUrl?param2=foo
controllers.someAction (request, response) {
  var allParams = router.FetchRequestAndDefaultParams(request);
  // allParams = { param1: 81, param2: 'foo' }
}
```
Note: You can override default parameters if given in the url.

If you specify values for a parameter in `routes` object, the router controls the parameter and if the value of the parameter is not in values array, it reverts to its default value.

```js
var routes = [
  {
    name: 'routeName',
    url: '/someUrl',
    action: /'someAction',
    params: {
      param1: { values: ['foo', 'bar']; default: 'foo'; }
}];
// When requesting /someUrl?param1=baz
controllers.someAction (request, response) {
  var allParams = router.FetchRequestAndDefaultParams(request);
  // allParams = { param1: 'foo' }
}
