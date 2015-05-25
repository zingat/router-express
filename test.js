/*jslint nomen: true, todo: true, indent: 2 */
/*global require, module, __dirname, describe, it */

var assert = require('assert');
var utils  = require('./utils');

describe('Url regex cleaning', function () {
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