var mongooseControllers = require('mongoose-controllers');
var express = require('express');

var app = express();

// Magic setup of mongoose

var User = // User Model

app.get('/users', mongooseControllers.get(User, {
  name: "Default Name"
}));

app.post('/users/post', mongooseControllers.post(User, {
  name: 'dataName' // the field in the passed in JSON
}));
