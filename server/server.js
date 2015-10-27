var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.send('aww yiss');
});

var server = app.listen(8080, function() {
  console.log('Server up');
});
