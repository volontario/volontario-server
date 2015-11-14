module.exports = function() {
  console.log('Initializing...');

  // Initialization
  let app = require('express')();
  let bodyParser = require('body-parser');
  let config = require('./config/config.js');
  let errorHandler = require('./errors/handler.js');
  let mongoose = require('mongoose');
  let mongooseConnection =
    require('./database/mongoose-connector.js')(config, mongoose);
  let routeBinder = require('./routing/binder.js');

  // Configuration
  app.use(bodyParser.urlencoded({extended: true}));

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
  }

  // Route binding
  routeBinder(mongooseConnection, app);

  // Error handling
  errorHandler(app);

  // Booting
  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
