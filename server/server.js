var config = (function() {
  var prefixGet = function(body) {
    var id = 'VOLONTARIO_' + process.env.NODE_ENV.toUpperCase() + '_' + body;
    return process.env[id];
  };

  return {
    EXPRESS_PORT: prefixGet('EXPRESS_PORT'),
    MONGO_URL: prefixGet('MONGO_URL'),
    MONGO_USERNAME: prefixGet('MONGO_USERNAME'),
    MONGO_PASSWORD: prefixGet('MONGO_PASSWORD'),
  };
}());

var express = require('express');
var mongooseConnection = require('./app/mongoose-connection.js')(config);
var controllerLoader = require('./app/controllers-loader.js');

var app = express();
controllerLoader(app, mongooseConnection);

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
}

app.listen(config.EXPRESS_PORT, function() {
  console.log('Server up');
});
