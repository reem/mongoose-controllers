var mongooseControllers = require('../lib');
var demand = require('must');

describe('mongoose-controllers', function () {
  it('should exist', function () {
    demand(mongooseControllers).to.exist();
  });
});
