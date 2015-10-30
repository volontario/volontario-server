var express = require('express');
var m = require('./app/mongoose-connection.js');
var app = express();

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
}

app.get('/', function(req, res) {
  res.json({});
});

app.get('/locations', function(req, res) {
  m.schemas.Location.find(req.query, function(_err, locations) {
    return res.json(locations);
  });
});

var server = app.listen(8080, function() {
  console.log('Server up');
});
