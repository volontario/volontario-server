var assert = require('assert');
var config = require('config');
var express = require('express');
var mongoose = require('mongoose');

var db = mongoose.connection;

var locationSchema = new mongoose.Schema({
  'category': String,
  'location': {
    'latitude': Number,
    'longitude': Number
  }
});

var Location = mongoose.model('Location', locationSchema);

mongoose.connect(config.get('mongo').url);

var app = express();

// For debugging in development
app.set('json spaces', 2);

app.get('/', function(req, res) {
  res.json({});
});

app.get('/locations', function(req, res) {
  Location.find({'category': req.query.category}, function(_err, locations) {
    return res.json(locations);
  });
});

var server = app.listen(8080, function() {
  console.log('Server up');
});
