module.exports = function() {
  console.log('Initializing...');

  let bodyParser = require('body-parser');
  let config = require('./config/config.js');
  let errorHandler = require('./errors/handler.js');
  let express = require('express');
  let mongoose = require('mongoose');
  let mongooseConnector = require('./database/mongoose-connector.js');
  let morgan = require('morgan');
  let routeBinder = require('./routing/binder.js');

  let mongooseConnection = mongooseConnector(config, mongoose);

  let app = express();

  app.use(bodyParser.urlencoded({extended: true}));

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
    app.use(morgan('dev'));
  } else {
    app.use(morgan('common'));
  }

  routeBinder(mongooseConnection, app);
  errorHandler(app);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
