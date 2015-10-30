var express = require('express');
var config = require('config');

var mongooseConnection = require('./app/mongoose-connection.js');
var controllerLoader = require('./app/controllers-loader.js');

var app = express();
controllerLoader(app, mongooseConnection);

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
}

app.listen(config.express.port, function() {
  console.log('Server up');
});
