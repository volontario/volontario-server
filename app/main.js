module.exports = function() {
  console.log('Initializing...');

  // Initialization
  let app = require('express')();
  let bodyParser = require('body-parser');
  let config = require('./config.js');
  let mongooseConnection = require('./mongoose-connection.js')(config);
  let routeBinder = require('./route-binder.js');

  // Configuration
  app.use(bodyParser.urlencoded({extended: true}));

  if (config.ENVIRONMENT === 'development') {
    app.set('json spaces', 2);
  }

  // Route binding
  routeBinder(mongooseConnection, app);

  // Booting
  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
