// Loading required libs
var _        = require('lodash');
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
function RouterExpress (routes, controller) {
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
	var controller = this.controller;
	var injectMw = this.injectMw;
	var middleware = middleware || false;

	_.forEach(this.routes, function (route) {
		if (!(_.has(route, 'action'))) throw new Error ('Route does not have an action: ' + route.name);

		var method = route.method || 'get';

		app[method](route.url, function (req, res) {
			res.params = Router.fetchParams(req, route);

			injectMw(req, res, middleware, function (req, res) {
				if (!(_.has(controller, route.action))) {
					throw new Error('Controller not found: ' + route.action);
				}
				else {
					controller[route.action](req,res);
				}
			});
		});
	});
}


RouterExpress.prototype.injectMw = function (req, res, middleware, callback) {
	if ( middleware) {
		middleware(req,res,function () {
			callback(req, res)
		})
	}
	else {
		callback(req, res);
	}
}


/**
 * Gets default params, overrides with route params
 *
 * @this {RouterExpress}
 * @param {object} request - Express request
 * @param {object} route - Route object
 * @returns {object} Parameters object
 */
RouterExpress.prototype.fetchParams = function (request, route) {
	var routeParams = route.params || {};
	var defaultParams = _.mapValues(routeParams, 'default');

	return _.merge(defaultParams, request.query, request.params, {route:route});
}



/**
 * Creates query for the filter for selected fields
 *
 * @this {RouterExpress}
 * @param {object} params Parameters object
 * @param {array} filters Filters array
 * @returns {string} Query string
 */
RouterExpress.prototype.createUrlQuery = function (params, filters) {
	var resultParams = _.pick(params, filters);

	// Removing empty elements
	var filteredResultParams = _.reduce(resultParams, function (result, num, key) {

		if (
			( _.isArray(num) && ! _.isEmpty(_.compact(num)) ) ||
			( ! _.isArray(num) && num )
		)
			result[key] = num;

		return result;
	}, {});

	return qs.stringify(filteredResultParams);
}









/**
 * Creates a URL based on route name and parameters
 *
 * @this {RouterExpress}
 * @param {string} routeName Name of the route
 * @param {object=} params Parameters object
 * @returns {string} Created url
 *
 * @example
 * route = { name: 'test', url: '/test' }
 * // returns "/test?param1=foo"
 * RouterExpress.createUrl('test', {param1: 'foo'})
 *
 * @TODO: Will use url lib to create urls instead
 */
RouterExpress.prototype.createUrl = function (routeName, params) {
	// Get route object for the routeName
	var routeObject = _.findWhere(this.routes, {name: routeName});

	// Get route url to parse the url
	var url = routeObject.url;

	// Get route default params
	var routeDefaultParams = _.has(routeObject, 'params')
		? routeObject.params
		: {};

	// To track first extra param with ? and others with &
	// @TODO: Can we do this with qs/querystring
	var getParamsUsed = false;

	for (paramName in params) {
		// Get parameter value
		var paramValue = params[paramName];

		// @TODO: Router.defaults tan kontrol et, varsa ve aynıysa hiç ekleme
		//if (paramValue !== defaults[paramName]) {
			// If parameter exists in the route, put it in the route
			if (url.search(paramName) != -1) {
				url = url.replace(':'+paramName+'?', paramValue);
				url = url.replace(':'+paramName, paramValue);
			}
			// If not, add it to the end
			else {
				url += getParamsUsed
					? '&'
					: '?';
				url += paramName + '=' + paramValue;
				getParamsUsed = true;
			}
		//}
	}

	// Removing all unused url parameters
	url = url.replace(/\/:[a-zA-Z]*[\?]?/g, '');

	return url;
}

RouterExpress.prototype.addParamToParams = function (params, name, value) {
	if ( undefined !== value ) {
		params[name] = value;
	}
	else {
		if (name in params) {
			delete params[name];
		}
	}
	return params;
}



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
	var parsedUrl = url.parse(baseurl,true);
	var query = parsedUrl.query;

	var pathname = parsedUrl.pathname;
	var route = _.findWhere(this.routes, {url: pathname});

	// Checking default param value, empty if value is default
	if (_.has(route, 'params')) {
		if (_.has(route.params, param)) {
			if ( value == route.params[param].default ) {
				value = undefined;
			}
		}
	}

	var updatedParams = this.addParamToParams (query, param, value);

	return this.createUrl(route.name, updatedParams);
}



module.exports = RouterExpress;