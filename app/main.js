module.exports = function() {
  console.log('Initializing...');

  const bodyParser = require('body-parser');
  const crypto = require('crypto');
  const express = require('express');
  const mongoose = require('mongoose');
  const morgan = require('morgan');
  const passport = require('passport');
  const PassportBasicStrategy = require('passport-http').BasicStrategy;
  const pbkdf2 = require('pbkdf2');

  const basicStrategyConfigurer = require('./auth/basic.js');
  const config = require('./config.js');
  const errorHandler = require('./errors/handler.js');
  const mongooseConnector = require('./database/mongoose-connector.js');
  const router = require('./router.js');

  const mongooseConnection = mongooseConnector(config, mongoose);

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.use(passport.initialize());

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
    app.use(morgan('dev'));
  } else {
    app.use(morgan('common'));
  }

  const digester = function(pw, salt) {
    return pbkdf2
      .pbkdf2Sync(pw, salt, 16384, 128, 'sha512')
      .toString('utf8');
  };

  basicStrategyConfigurer(
    passport,
    PassportBasicStrategy,
    digester,
    mongooseConnection.schemas.User
  );

  router(
    mongooseConnection.schemas,
    passport,
    app,
    digester,
    () => crypto.randomBytes(128).toString('utf8')
  );
  errorHandler(app);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
