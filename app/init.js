module.exports = function() {
  // Initialization
  var config = require('./config.js');
  var routesLoader = require('./routes-loader.js');
  var express = require('express');
  var mongooseConnection = require('./mongoose-connection.js')(config);
  var bodyParser = require('body-parser');

  var app = express();
  routesLoader(mongooseConnection, app);

  // Configuration
  app.use(bodyParser.urlencoded({extended: true}));

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
  }

  // Booting
  app.listen(config.EXPRESS_PORT, function() {
    console.log('Server up');
  });
};
