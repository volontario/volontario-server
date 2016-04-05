module.exports = function() {
  console.log('Initializing...');

  const bodyParser = require('body-parser');
  const cors = require('cors');
  const express = require('express');
  const mongoose = require('mongoose');
  const morgan = require('morgan');
  const passport = require('passport');
  const PassportBasicStrategy = require('passport-http').BasicStrategy;
  const PassportFacebookStrategy = require('passport-facebook').Strategy;

  const authConfigurer = require('./auth/basic.js');
  const config = require('./config.js');
  const dotQueryParser = require('./middleware/dot-query-parser.js');
  const errorHandler = require('./middleware/error-handler.js');
  const controllerHelpersInit = require('./controllers/helpers.js');
  const mongooseConnector = require('./database/mongoose-connector.js');
  const router = require('./router.js');

  const mongooseConnection = mongooseConnector(config, mongoose);

  const controllerHelpers = controllerHelpersInit(mongooseConnection.schemas);

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.use(cors());

  app.use(passport.initialize());

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
    app.use(morgan('dev'));
  } else {
    app.use(morgan('common'));
  }

  app.use(dotQueryParser);

  authConfigurer(
    passport,
    PassportBasicStrategy,
    PassportFacebookStrategy,
    mongooseConnection.schemas,
    controllerHelpers
  );

  router(mongooseConnection.schemas, controllerHelpers, passport, app);

  app.use(errorHandler);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
