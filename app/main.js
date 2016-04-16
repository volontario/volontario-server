module.exports = function() {
  console.log('Initializing...');

  const bodyParser = require('body-parser');
  const cors = require('cors');
  const express = require('express');
  const mongoose = require('mongoose');
  const morgan = require('morgan');
  const passport = require('passport');
  const PassportBasicS = require('passport-http').BasicStrategy;
  const PassportFacebookS = require('passport-facebook').Strategy;

  const authConfigurer = require('./auth/config.js');
  const basicAuther = require('./auth/basic.js');
  const facebookAuther = require('./auth/facebook.js');
  const config = require('./config.js');
  const dotQueryParser = require('./middleware/dot-query-parser.js');
  const errorHandler = require('./middleware/error-handler.js');
  const controllerHelpersInit = require('./controllers/helpers.js');
  const mongooseConnector = require('./database/mongoose-connector.js');
  const router = require('./router.js');

  const mongooseConn = mongooseConnector(config, mongoose);

  const ctrlHelpers = controllerHelpersInit(mongooseConn.schemas);

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

  authConfigurer(passport);
  basicAuther(passport, PassportBasicS, mongooseConn.schemas, ctrlHelpers);
  facebookAuther(passport, PassportFacebookS, mongooseConn.schemas, config);

  router(config, mongooseConn.schemas, ctrlHelpers, passport, app);

  app.use(errorHandler);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
