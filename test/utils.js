/* jslint nomen: true, todo: true, indent: 2 */
/* global require, module, __dirname, describe, it */

var assert = require('assert')
var utils = require('../utils')

// addParamToParams

describe('Unit::utils.addParamToParams', function () {
  it('should add a normal param to params', function () {
    assert.deepEqual({foo: 'bar', baz: 'qux'}, utils.addParamToParams({foo: 'bar'}, 'baz', 'qux'))
  })

  it('should update a param', function () {
    assert.deepEqual({foo: 'baz'}, utils.addParamToParams({foo: 'bar'}, 'foo', 'baz'))
  })

  it('should delete a param', function () {
    assert.deepEqual({}, utils.addParamToParams({foo: 'bar'}, 'foo', undefined))
    assert.deepEqual({}, utils.addParamToParams({foo: 'bar'}, 'foo', ''))
  })
})

// checkAndAddParam

describe('Unit::utils.checkAndAddParam', function () {
  var sampleRoute = {
    regexUrl: /\/(.*)\-?satilik/,
    regexParams: ['location'],
    params: {
      param1: { default: 'foo' }
    }
  }

  it('should not add a param with a default value', function () {
    assert.deepEqual({}, utils.checkAndAddParam(sampleRoute, {}, 'param1', 'foo'))
  })

  it('should add a param with a different value', function () {
    assert.deepEqual({param1: 'bar'}, utils.checkAndAddParam(sampleRoute, {}, 'param1', 'bar'))
  })
})

// cleanUrl

describe('Unit::utils.cleanUrl', function () {
  it('should convert regex properly', function () {
    assert.equal(utils.cleanUrl('/satilik'), '/satilik')
    assert.equal(utils.cleanUrl('//satilik'), '/satilik')
    assert.equal(utils.cleanUrl('///satilik'), '/satilik')
    assert.equal(utils.cleanUrl('////satilik'), '/satilik')
    assert.equal(utils.cleanUrl('/-satilik'), '/satilik')
    assert.equal(utils.cleanUrl('/satilik-'), '/satilik')
    assert.equal(utils.cleanUrl('/-satilik-'), '/satilik')
    assert.equal(utils.cleanUrl('/yazi/etiket//nufus-yapisi'), '/yazi/etiket/nufus-yapisi')
  })
})

// utils.createUrlQuery

describe('Unit::utils.createUrlQuery', function () {
  it('should select some fields normally', function () {
    assert.deepEqual(
      utils.createUrlQuery({a: 1, b: 2, c: 3}, ['a', 'b']),
      'a=1&b=2'
    )
  })

  it('should clean empty elements', function () {
    assert.deepEqual(utils.createUrlQuery({a: undefined, b: 2, c: 3}, ['a', 'b']), 'b=2')
    assert.deepEqual(utils.createUrlQuery({a: '', b: 2, c: 3}, ['a', 'b']), 'b=2')
    assert.deepEqual(utils.createUrlQuery({a: null, b: 2, c: 3}, ['a', 'b']), 'b=2')
  })

  it('should add arrays', function () {
    assert.deepEqual(
      utils.createUrlQuery({a: 1, b: [2, 3], c: 4}, ['a', 'b']),
      'a=1&b%5B0%5D=2&b%5B1%5D=3'
    )
  })

  it('should clean empty array elements', function () {
    assert.deepEqual(
      utils.createUrlQuery({a: 1, b: [2, ''], c: 4}, ['a', 'b']),
      'a=1&b%5B0%5D=2'
    )
  })

  it('should remove empty arrays', function () {
    assert.deepEqual(
      utils.createUrlQuery({a: 1, b: [null, ''], c: 4}, ['a', 'b', 'c']),
      'a=1&c=4'
    )
  })
})

// getParamsFromUrl

describe('Unit::utils.getParamsFromUrl', function () {
  var sampleRoute = {
    regexUrl: /\/(.*)\-?satilik/,
    regexParams: ['location']
  }

  it('should get no params', function () {
    assert.deepEqual({}, utils.getParamsFromUrl('/satilik'), sampleRoute)
  })

  it('should get a regex param', function () {
    assert.deepEqual({location: 'istanbul'}, utils.getParamsFromUrl('/istanbul-satilik', sampleRoute))
  })

  it('should get a query param', function () {
    assert.deepEqual({location: '', foo: 'bar'}, utils.getParamsFromUrl('/satilik?foo=bar', sampleRoute))
  })
})

// getRegexParams

describe('Unit::utils.getRegexParams', function () {
  var sampleRoute = {
    regexUrl: /\/?(.*)\/satilik-?(.*)/,
    regexParams: ['param1', 'param2']
  }

  it('should get one regex param', function () {
    assert.deepEqual({param1: 'remax', param2: ''}, utils.getRegexParams('/remax/satilik', sampleRoute))
  })

  it('should get two regex params', function () {
    assert.deepEqual({param1: 'efe', param2: 'daire'}, utils.getRegexParams('/efe/satilik-daire', sampleRoute))
  })

  it('should get no regex params', function () {
    assert.deepEqual({param1: '', param2: ''}, utils.getRegexParams('/satilik', sampleRoute))
  })
})

// prepareUrl

describe('Unit::utils.prepareUrl', function () {
  it('should work normally', function () {
    assert.strictEqual(utils.prepareUrl('/list', {a: 1}), '/list?a=1')
  })

  it('should support empty params', function () {
    assert.strictEqual(utils.prepareUrl('/list', {}), '/list')
  })

  it('should clean the url', function () {
    assert.strictEqual(utils.prepareUrl('/list-', {b: 2}), '/list?b=2')
  })
})
