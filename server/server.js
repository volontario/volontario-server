var config = require('./app/config.js');
var routesLoader = require('./app/routes-loader.js');
var express = require('express');
var mongooseConnection = require('./app/mongoose-connection.js')(config);

var app = express();
routesLoader(app, mongooseConnection);

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
}

// For compatibility with Heroku
var expressPort = config.EXPRESS_PORT || process.env.PORT;

app.listen(expressPort, function() {
  console.log('Server up');
});
