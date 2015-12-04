module.exports = function() {
  console.log('Initializing...');

  let bodyParser = require('body-parser');
  let crypto = require('crypto');
  let express = require('express');
  let mongoose = require('mongoose');
  let morgan = require('morgan');
  let passport = require('passport');
  let PassportBasicStrategy = require('passport-http').BasicStrategy;
  let pbkdf2 = require('pbkdf2');

  let basicStrategyConfigurer = require('./auth/basic.js');
  let config = require('./config.js');
  let errorHandler = require('./errors/handler.js');
  let mongooseConnector = require('./database/mongoose-connector.js');
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

  let digester = function(pw, salt) {
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

  routeBinder(
    mongooseConnection,
    passport,
    app,
    digester,
    () => crypto.randomBytes(128).toString('utf8')
  );
  errorHandler(app);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
