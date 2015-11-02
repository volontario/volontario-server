var config = require('./app/config.js');
var routesLoader = require('./app/routes-loader.js');
var express = require('express');
var mongooseConnection = require('./app/mongoose-connection.js')(config);

var app = express();
routesLoader(app, mongooseConnection);

if (config.ENVIRONMENT === 'development') {
  app.set('json spaces', 2);
}

app.listen(config.EXPRESS_PORT, function() {
  console.log('Server up');
});
