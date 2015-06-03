/*jslint nomen: true, todo: true, indent: 2 */
/*global require, module, __dirname, describe, it */

var assert = require('assert');
var utils  = require('./utils');

describe('cleanUrl:', function () {
  "use strict";

  it('should convert regex properly', function () {
    assert.equal(utils.cleanUrl('/satilik'), '/satilik')
    assert.equal(utils.cleanUrl('//satilik'), '/satilik')
    assert.equal(utils.cleanUrl('///satilik'), '/satilik')
    assert.equal(utils.cleanUrl('////satilik'), '/satilik')
    assert.equal(utils.cleanUrl('/-satilik'), '/satilik')
    assert.equal(utils.cleanUrl('/satilik-'), '/satilik')
    assert.equal(utils.cleanUrl('/-satilik-'), '/satilik')
    assert.equal(utils.cleanUrl('/yazi/etiket//nufus-yapisi'), '/yazi/etiket/nufus-yapisi')
  });
});

describe('addParamToParams:', function () {
  "use strict";

  it('should add a normal param to params', function () {
    assert.deepEqual({foo: 'bar', baz: 'qux'}, utils.addParamToParams({foo: 'bar'}, 'baz', 'qux'));
  });

  it('should update a param', function () {
    assert.deepEqual({foo: 'baz'}, utils.addParamToParams({foo: 'bar'}, 'foo', 'baz'));
  });

  it('should delete a param', function () {
    assert.deepEqual({}, utils.addParamToParams({foo: 'bar'}, 'foo', undefined));
  });
});

describe('getRegexParams:', function () {
  "use strict";

  var sampleRoute = {
    regexUrl: /\/?(.*)\/satilik-?(.*)/,
    regexParams: ['param1', 'param2']
  }

  it('should get one regex param', function () {
    assert.deepEqual({param1:'remax',param2:''}, utils.getRegexParams('/remax/satilik', sampleRoute));
  });

  it('should get two regex params', function () {
    assert.deepEqual({param1:'efe',param2:'daire'}, utils.getRegexParams('/efe/satilik-daire', sampleRoute));
  });

  it('should get no regex params', function () {
    assert.deepEqual({param1:'',param2:''}, utils.getRegexParams('/satilik', sampleRoute));
  });
});

describe('getParamsFromUrl:', function () {
  "use strict";

  var sampleRoute = {
    regexUrl: /\/(.*)\-?satilik/,
    regexParams: ['location']
  }

  it('should get no params', function () {
    assert.deepEqual({}, utils.getParamsFromUrl('/satilik'), sampleRoute);
  });

  it('should get a regex param', function () {
    assert.deepEqual({location:'istanbul'}, utils.getParamsFromUrl('/istanbul-satilik', sampleRoute));
  });

  it('should get a query param', function () {
    assert.deepEqual({location:'',foo:'bar'}, utils.getParamsFromUrl('/satilik?foo=bar', sampleRoute));
  });
});

describe('checkAndAddParam:', function () {
  "use strict";

  var sampleRoute = {
    regexUrl: /\/(.*)\-?satilik/,
    regexParams: ['location'],
    params: {
      param1: { default: 'foo' }
    }
  }

  it('should not add a param with a default value', function () {
    assert.deepEqual({}, utils.checkAndAddParam(sampleRoute, {}, 'param1', 'foo'))
  });

  it('should add a param with a different value', function () {
    assert.deepEqual({param1:'bar'}, utils.checkAndAddParam(sampleRoute, {}, 'param1', 'bar'))
  });
});