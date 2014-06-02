var q = require('q');
var _ = require('lodash');

var buildCreate = function (fields, body) {
  var result = {};
  _.each(fields, function (val, key) { result[key] = body[val]; });
  return result;
};

module.exports = exports = {
  get: function (model, defaults) {
    return function (req, res) {
      q(model.find(
        req.query.matching || req.body.matching || defaults.matching,
        req.query.fields   || req.body.fields   || defaults.fields,
        req.query.options  || req.body.options  || defaults.options).exec())
      .then(res.json.bind(res))
      .fail(module.exports.internalServerError(res));
    };
  },
  post: function (model, fields) {
    return function (req, res) {
      q(model.create(buildCreate(fields, req.body)))
        .then(module.exports.saveHandler(res))
        .fail(module.exports.internalServerError(res));
    };
  }
};
