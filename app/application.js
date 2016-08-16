/**
 * Application preparation
 */
module.exports = function(config, mongooseConn, passport) {
  // Initialize application
  const express = require('express');
  const app = express();

  // Parse JSON bodies
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Allow CORS requests
  const cors = require('cors');
  app.use(cors());

  // Apply Passport
  const authConfigurer = require('./auth/config.js');
  authConfigurer(passport);
  const basicAuther = require('./auth/basic.js');
  basicAuther(passport, mongooseConn.schemas);
  const facebookAuther = require('./auth/facebook.js');
  facebookAuther(passport, mongooseConn.schemas, config);

  app.use(passport.initialize());

  // Make responses look nicer in dev
  const morgan = require('morgan');
  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
    app.use(morgan('dev'));
  } else {
    app.use(morgan('common'));
  }

  // Parse queries with dot notation
  const dotQueryParser = require('./middleware/dot-query-parser.js');
  app.use(dotQueryParser);

  // Handle errors
  const errorHandler = require('./middleware/error-handler.js');
  app.use(errorHandler);

  return app;
};
