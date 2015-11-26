module.exports = function() {
  console.log('Initializing...');

  let basicStrategyConfigurer = require('./auth/basic.js');
  let bodyParser = require('body-parser');
  let config = require('./config/config.js');
  let errorHandler = require('./errors/handler.js');
  let express = require('express');
  let mongoose = require('mongoose');
  let mongooseConnector = require('./database/mongoose-connector.js');
  let morgan = require('morgan');
  let passport = require('passport');
  let PassportBasicStrategy = require('passport-http').BasicStrategy;
  let routeBinder = require('./routing/binder.js');

  let mongooseConnection = mongooseConnector(config, mongoose);

  let app = express();

  app.use(bodyParser.urlencoded({extended: true}));

  app.use(passport.initialize());

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
    app.use(morgan('dev'));
  } else {
    app.use(morgan('common'));
  }

  basicStrategyConfigurer(
    passport,
    PassportBasicStrategy,
    mongooseConnection.schemas.User
  );

  routeBinder(mongooseConnection, passport, app);
  errorHandler(app);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
