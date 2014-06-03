var q = require('q');
var _ = require('lodash');

var buildCreate = function (fields, body) {
  var result = {};
  _.each(fields, function (val, key) { result[key] = body[val]; });
  return result;
};

var internalServerError = function (res) {
  return function (err) {
    console.error(err.stack);
    res.send(500, "Internal Server Error.");
  };
};

var saveHandler = function (res) {
  return function (saved) {
    if (!saved) {
      throw new Error("Failed to save.");
    } else {
      res.send("201", "Posted Data.");
    }
  };
};

module.exports = exports = {
  get: function (model, defaults) {
    return function (req, res) {
      q(model.find(
        _.defaults({}, req.query.matching, req.body.matching, defaults.matching),
        _.defaults({}, req.query.fields,   req.body.fields,   defaults.fields),
        _.defaults({}, req.query.options,  req.body.options,  defaults.options)
      ).exec())
      .then(res.json.bind(res))
      .fail(internalServerError(res));
    };
  },
  post: function (model, fields, defaults) {
    return function (req, res) {
      q(model.findOneAndUpdate(
        buildCreate(fields, req.body),
        _.defaults({}, req.body.action, defaults.action),
        _.defaults({}, req.body.options, defaults.options, {upsert: true})
      ).exec())
      .then(saveHandler(res))
      .fail(internalServerError(res));
    };
  }
};
