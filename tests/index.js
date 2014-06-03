var mongooseControllers = require('../lib');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/medhawk');

var User = mongoose.model("User", new mongoose.Schema({
  name: String
}));

var app = require('express')();
app.use(require('body-parser')());

app.get("/users",
  mongooseControllers.get(User, {name: ""}));
app.post("/users/post",
  mongooseControllers.post(User, {name: "name"}, {}));

var closeHandler = app.listen(3000);

var reqUrl = 'http://localhost:3000';

var demand = require('must');
var request = require('request');
var _ = require('lodash');

describe('mongoose-controllers', function () {
  before(function (done) {
    User.create({name: "Test"}).then(function () {
      done();
    });
  });

  after(function (done) {
    User.findOne({name: "Test"}).exec().then(function (user) {
      user.remove();
    }).then(function () {
      closeHandler.close(done);
    });
  });

  describe('get', function () {
    it('should exist', function () {
      demand(mongooseControllers).to.exist();
    });

    it('should return 200 on a get request', function (done) {
      request.get(reqUrl + '/users', function (error, response) {
        demand(!!error).to.be.false();
        demand(response.statusCode).to.equal(200);
        done();
      });
    });

    it('should return the right drugs', function (done) {
      request.get(reqUrl + '/users', function (error, response, body) {
        demand(!!error).to.be.false();
        demand(_.pluck(JSON.parse(body), 'name')).to.include("Test");
        done();
      });
    });

    it('should support robust queries', function (done) {
      request.get(reqUrl + '/users', {form:
        {appKey: "TestKey", matching: {name: "Test"}}
      }, function (error, response, body) {
        demand(!!error).to.be.false();
        demand(JSON.parse(body)[0].name).to.equal("Test");
        done();
      });
    });
  });

  describe('post', function () {
    it('should return 201 and post to the database on a post request.', function (done) {
      request.post(reqUrl + '/users/post', {
        form: {name: "TestPost"}
      }, function (error, response) {
        demand(!!error).to.be.false();
        demand(response.statusCode).to.equal(201);

        User.findOne({name: "TestPost"}).exec()
          .then(function (user) {
            demand(user).to.exist();
            user.remove();
          }).then(function () {
            done();
          });
      });
    });
  });
});

