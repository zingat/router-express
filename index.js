/*jslint nomen: true, todo: true */
/*global require, Router, console, module */
// @TODO Update JSDOC

/**
* Dependencies
*/

var _        = require('lodash');
var access   = require('safe-access');
var qs       = require('qs');
var url      = require('url');

/**
* Initializes router
*
* @constructor
* @this {RouterExpress}
* @param {object} routes Route object
* @param {object} controller Controller object
*/
function RouterExpress(routes, controller) {
  "use strict";

  this.controller = controller;
  this.routes = routes;
}

/**
* Binds routes to actions
*
* @this {RouterExpress}
* @param {object} app - Express app
*/

RouterExpress.prototype.bind = function (app, middleware) {
  "use strict";

  var controller = this.controller,
  injectMw = this.injectMw;

  if (middleware === undefined) {
    middleware = false;
  }

  _.forEach(this.routes, function (route) {
    if (!(_.has(route, 'action'))) {
      throw new Error('Route does not have an action: ' + route.name);
    }

    var method = route.method || 'get';

    app[method](route.url, function (req, res) {
      res.params = Router.fetchParams(req, route);

      injectMw(req, res, middleware, function (req, res) {
        if (!(_.has(controller, route.action))) {
          throw new Error('Controller not found: ' + route.action);
        }

        controller[route.action](req, res);
      });
    });
  });
};

/**
* Injects middleware
*/

RouterExpress.prototype.injectMw = function (req, res, middleware, callback) {
  "use strict";

  if (middleware) {
    middleware(req, res, function () {
      callback(req, res);
    });
  } else {
    callback(req, res);
  }
};

/**
* Gets default params, overrides with route params
*
* @this {RouterExpress}
* @param {object} request - Express request
* @param {object} route - Route object
* @returns {object} Parameters object
*/

RouterExpress.prototype.fetchParams = function (request, route) {
  "use strict";

  var routeParams = route.params || {},
  defaultParams = _.mapValues(routeParams, 'default');

  return _.merge(defaultParams, request.query, request.params, {route: route});
};

/**
* Creates query for the filter for selected fields
*
* @this {RouterExpress}
* @param {object} params Parameters object
* @param {array} filters Filters array
* @returns {string} Query string
*/

RouterExpress.prototype.createUrlQuery = function (params, filters) {
  "use strict";

  var resultParams = _.pick(params, filters),
  filteredResultParams;

  // Removing empty elements
  filteredResultParams = _.reduce(resultParams, function (result, num, key) {

    if (_.isArray(num)) {
      num = _.compact(num);
    }

    if ((_.isArray(num) && !(_.isEmpty(num))) || (!(_.isArray(num)) && num)) {
      result[key] = num;
    }

    return result;
  }, {});

  return qs.stringify(filteredResultParams);
};

/**
* Creates a URL based on route name and parameters
*
* @this {RouterExpress}
* @param {string} routeName - Name of the route
* @param {object=} params   - Parameters object
* @returns {string}         - Created url
*
* @example
* route = { name: 'someRoute', url: '/someUrl' };
* // returns "/someUrl?param1=foo"
* RouterExpress.createUrl('someRoute', {param1: 'foo'})
*/

RouterExpress.prototype.createUrl = function (routeName, params) {
  "use strict";

  var routeObject = _.findWhere(this.routes, {name: routeName}),
  routeParams = access(routeObject, 'params'),
  routeParamsDefaultValues = _.mapValues(routeParams, 'default'),
  filteredParams = _.omit(params, function (v, k) {
    return routeParamsDefaultValues[k] === v;
  }),
  urlSuffix = qs.stringify(filteredParams),
  urlSeperator = urlSuffix ? '?' : '';

  return routeObject.url + urlSeperator + urlSuffix;
};

/**
* Adds param?
*/

RouterExpress.prototype.addParamToParams = function (params, name, value) {
  "use strict";

  if (undefined !== value) {
    params[name] = value;
  } else {
    if (params.hasOwnProperty(name)) {
      delete params[name];
    }
  }
  return params;
};

/**
* Updates a url based on a parameter and its value
* If no value specified, the parameter is removed from url
*
* @this {RouterExpress}
* @param {string} baseurl The url to update
* @param {string} param Name of the parameter to update
* @param {primitive} value Value of the parameter, empty if to remove parameter
* @returns {string} New url
*/

RouterExpress.prototype.updateUrlWithParam = function (baseurl, param, value) {
  "use strict";

  var parsedUrl = url.parse(baseurl, true),
  query = parsedUrl.query,
  pathname = parsedUrl.pathname,
  route = _.findWhere(this.routes, {url: pathname}),
  updatedParams;

  // Checking default param value, empty if value is default
  if (_.has(route, 'params')) {
    if (_.has(route.params, param)) {
      if (value === route.params[param].default) {
        value = undefined;
      }
    }
  }

  updatedParams = this.addParamToParams(query, param, value);

  return this.createUrl(route.name, updatedParams);
};

module.exports = RouterExpress;
