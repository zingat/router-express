// Loading required libs
var _        = require('underscore');
var isObject = require('is-object');
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
 * Applies routing table to Express App
 *
 * @this {RouterExpress}
 * @param {object} expressApp Express application
 */
RouterExpress.prototype.apply = function (expressApp) {
	for (var i=0; i<this.routes.length; i++) {
		var route = this.routes[i];

		var url = route.url;
		var method = 'method' in route
			? route.method.toLowerCase()
			: 'get';
		var controller = this.controller[route.action];

		expressApp[method](url, controller);
	}
}



/**
 * Creates a URL based on route name and parameters
 *
 * @this {RouterExpress}
 * @param {string} routeName Name of the route
 * @param {object} params Parameters object
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



/**
 * Fetches and merges all params from request and defaults
 * Default is fetched from route object
 * Request param is overriden if exists
 * If values exist in route object, compares request param
 *   and if not valid, overrides with default value
 *
 * @this {RouterExpress}
 * @param {object} request Express request object
 * @returns {object} Parameters object
 */
RouterExpress.prototype.fetchRequestAndDefaultParams = function (request) {
	var results = {};

	// Get all request query parameters
	for (queryParamName in request.query) {
		results[queryParamName] = request.query[queryParamName];
	}

	// Fetcing route object
	var routeObject = this.getRouteObjectFromRequest(request);

	// Get default route params
	var defaultParameters = _.has(routeObject, 'params')
		? isObject(routeObject['params'])
			? routeObject['params']
			: {}
		: {}
	;

	// For each default param
	for (paramName in defaultParameters) {
		var param = defaultParameters[paramName];

		// If this does not exist in request params
		//if ( ! isObject(defaultParameters[paramName]) ) {
		if ( ! _.has(request.query, paramName)) {
			// Add to result params
			results[paramName] = param.default;
		}

		// If exists in the request params
		else {
			// If there are standard values
			if ( undefined !== param['values'] ) {
				// If request value does not exist in available values
				if ( ! _.contains(param['values'], results[paramName])) {
					// Change parameter value to route default
					results[paramName] = defaultParameters[paramName]['default'];
				}
			}
		}
	}
	return results;
}



/**
 * Finds a route from routes object
 *
 * @this {RouterExpress}
 * @param {object} request Express request object
 * @returns {object} Parameters object
 */
RouterExpress.prototype.getRouteObjectFromRequest = function (request) {
	// Get base pathname
	var pathname = request._parsedUrl.pathname;

	// Finds and returns route object
	return _.findWhere(this.routes, {url: pathname});
}



/**
 * Creates query for the filter for selected fields
 *
 * @this {RouterExpress}
 * @param {object} params Parameters object
 * @param {array} filters Filters array
 * @returns {string} Query string
 *
 * @TODO: Can we do this with underscore?
 */
RouterExpress.prototype.createUrlSearchQuery = function (params, filters) {
	
	var resultParams = {};

	for (paramName in params) {
		if (_.contains(filters, paramName)) {
			resultParams[paramName]  = params[paramName];
		}
	}
	
	//var result = querystring.stringify(resultParams)
	var result = qs.stringify(resultParams);
	return result;
}



module.exports = RouterExpress;