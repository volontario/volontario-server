var express = require('express');

var app = express();

app.set('json spaces', 2);

app.get('/', function(req, res) {
  res.json({});
});

var server = app.listen(8080, function() {
  console.log('Server up');
});
