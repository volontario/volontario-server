var config = require('./config.js');
var routesLoader = require('./routes-loader.js');
var express = require('express');
var mongooseConnection = require('./mongoose-connection.js')(config);

var app = express();
routesLoader(mongooseConnection, app);

if (config.ENVIRONMENT === 'development') {
  app.set('json spaces', 2);
}

app.listen(config.EXPRESS_PORT, function() {
  console.log('Server up');
});
