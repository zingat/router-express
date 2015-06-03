/*jslint nomen: true, todo: true, indent: 2, regexp: true */
/*global require, Router, console, module */
// @TODO Update JSDOC

/**
* Dependencies
*/

var _         = require('lodash');
var access    = require('safe-access');
var async     = require('async');
var qs        = require('qs');
var url       = require('url');
var utils     = require('./utils');

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
 * Groups routes by order type
 * @param {Array} routes
 * @param {Function} callback
 */

RouterExpress.prototype.parseOrders = function (routes, callback) {
  "use strict";

  var noOrderRoutes = _.filter(routes, function (route) {
    return !(_.has(route, 'order')) && !(_.has(route, 'lastOrder'));
  }),
    orderRoutes = _.groupBy(_.filter(routes, function (route) {
      return _.has(route, 'order');
    }), function (route) {
      return route.order;
    }),
    lastOrderRoutes = _.groupBy(_.filter(routes, function (route) {
      return _.has(route, 'lastOrder');
    }), function (route) {
      return route.lastOrder;
    });

  callback(noOrderRoutes, orderRoutes, lastOrderRoutes);
};

/**
* Binds routes to actions
*
* @this {RouterExpress}
* @param {object} app - Express app
*/

RouterExpress.prototype.bind = function (app, middleware) {
  "use strict";

  if (middleware === undefined) { middleware = false; }
  this.middleware = middleware;

  var that = this;

  this.parseOrders(this.routes, function (noOrderRoutes, orderRoutes, lastOrderRoutes) {
    that.parseOrderedRoutes(app, orderRoutes, that, function () {
      async.forEach(noOrderRoutes, function (route, midCallback) {
        that.injectRoute(app, route, that);

        midCallback();
      }, function (err) {
        if (err) { throw new Error('Error on iteration!'); }

        that.parseOrderedRoutes(app, lastOrderRoutes, that, function () {
          console.log('Routes added');
        });
      });
    });
  });
};

/**
 * Binds ordered routes to app
 *
 * @param {Object} app
 * @param {Array} orderedRoutes
 * @param {Object} that - RouterExpress object
 * @param {Function} callback
 */

RouterExpress.prototype.parseOrderedRoutes = function (app, orderedRoutes, that, callback) {
  "use strict";

  async.forEach(Object.keys(orderedRoutes), function (order, midCallback) {
    var routes = access(orderedRoutes, order);

    _.forEach(routes, function (route) {
      that.injectRoute(app, route, that);
    });

    midCallback();

  }, function (err) {
    if (err) { throw new Error('Error on iteration!'); }

    callback();
  });
};

/**
 * Injects a route to app
 *
 * @param {Object} app
 * @param {Object} route
 * @param {Object} that - RouterExpress Object
 */

RouterExpress.prototype.injectRoute = function (app, route, that) {
  "use strict";

  if (!(_.has(route, 'action'))) {
    throw new Error('Route does not have an action: ' + route.name);
  }

  var method = route.method || 'get';

  var url = route.regexUrl || route.url;

  app[method](url, function (req, res) {
    res.params = that.fetchParams(req, route);

    that.injectMw(req, res, that.middleware, function (req, res) {
      if (!(_.has(that.controller, route.action))) {
        throw new Error('Controller not found: ' + route.action);
      }

      that.controller[route.action](req, res);
    });
  });
};

/**
 * Injects middleware
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} middleware
 * @param {Function} callback
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

  var regexParams = utils.getRegexParams(request.path, route);

  var routeParams = route.params || {},
    defaultParams = _.mapValues(routeParams, 'default');

  return _.merge(defaultParams, request.query, request.params, regexParams, {route: route});
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

  var routeObject               = _.findWhere(this.routes, {name: routeName});

  if (!routeObject) {
    throw new Error('createUrl failed. routeName=' + routeName + ' params=' + params);
  }

  var url                     = routeObject.url,
    routeParams               = access(routeObject, 'params'),
    routeParamsDefaultValues  = _.mapValues(routeParams, 'default'),
    filteredParams            = _.omit(params, function (v, k) {
      return routeParamsDefaultValues[k] === v;
    }),
    extraParams               = {},
    urlSuffix,
    urlSeperator,
    finalUrl;

  _.forEach(filteredParams, function (paramValue, paramName) {
    // If url regex has param as :param, replace it
    if (url.search(paramName) !== -1) {
      url = url
        .replace(':' + paramName + '?/?', paramValue + '/')
        .replace(':' + paramName + '?-?', paramValue + '-')
        .replace('-?:' + paramName + '?', '-' + paramValue)
        .replace(':' + paramName + '?', paramValue)
        .replace(':' + paramName, paramValue);
    } else {
      // If not, add it to the end
      extraParams[paramName] = paramValue;
    }
  });

  // Removing all unused url parameters
  url = utils.cleanUrl(url);

  // Adding query params to the end
  urlSuffix = qs.stringify(extraParams);
  urlSeperator = urlSuffix ? '?' : '';

  // Finalizing
  finalUrl = url + urlSeperator + urlSuffix;
  return finalUrl;
};

/**
* Updates a url based on a parameter and its value
* If no value specified, the parameter is removed from url
*
* @this {RouterExpress}
* @param {string} baseurl The url to update
* @param {string|array} param name or names array of the parameter to update
* @param {primitive} value Value of the parameter, empty if to remove parameter
* @returns {string} New url
*/

RouterExpress.prototype.updateUrlWithParam = function (baseurl, params, value, route) {
  "use strict";

  var allUrlParams = utils.getParamsFromUrl(baseurl, route);

  if (typeof params === 'object') {
    _.each(params, function (param) {
      allUrlParams = utils.checkAndAddParam(route, allUrlParams, param, value);
    })
  }
  else {
    allUrlParams = utils.checkAndAddParam(route, allUrlParams, params, value);
  }

  return this.createUrl(route.name, allUrlParams);
};

module.exports = RouterExpress;