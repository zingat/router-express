var _ = require('underscore')
var url = require('url');

exports.apply = function (expressApp, routes, controllers) {
	for (var i=0; i<routes.length; i++) {
		var route = routes[i]

		var method = 'method' in route ? route.method.toLowerCase() : 'get'
		var url = route.url
		var controller = controllers[route.action]

		expressApp[method](url, controller)
	}
}

/**
 * @TODO: Will use url lib to create urls instead
 */
exports.createUrl = function (routes, name, params) {
	// Get url structure from routing file
	var route = _.findWhere(routes, {name: name})
	var url = route.url
	var defaults = route.defaults !== undefined ? route.defaults : {}

	// To track first extra param with ? and others with &
	var getParamsUsed = false

	for (paramName in params) {
		// Get parameter value
		var paramValue = params[paramName]

		//if (!paramName in defaults) {
		if (paramValue !== defaults[paramName]) {

			// If parameter exists in the route, put it in the route
			if (url.search(paramName) != -1) {
				url = url.replace(":"+paramName+"?", paramValue)
				url = url.replace(":"+paramName, paramValue)
			}
			// If not, add it to the end
			else {
				url += getParamsUsed ? "&" : "?"
				url += paramName + "=" + paramValue
				getParamsUsed = true
			}
		}


	}

	// Removing all unused url parameters
	url = url.replace(/\/:[a-zA-Z]*[\?]?/g, '')

	return url
}


exports.updateUrlWithParam = function (routes, baseurl, param, value) {
	var parsedUrl = url.parse(baseurl,true)
	var query = parsedUrl.query
	var pathname = parsedUrl.pathname
	var routename = _.findWhere(routes, {url: pathname}).name

	if ( undefined !== value ) {
		query[param] = value
	}
	else {
		if (param in query) {
			delete query[param];
		}
	}

	return this.createUrl(routes, routename, query)
}
