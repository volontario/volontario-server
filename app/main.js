module.exports = function() {
  console.log('Initializing...');

  const config = require('./config.js');
  const mongooseConnector = require('./database/mongoose-connector.js');
  const router = require('./router.js');
  const passport = require('passport');

  const mongooseConn = mongooseConnector(config);

  const app = require('./application.js')(config, mongooseConn, passport);

  router(config, mongooseConn.schemas, passport, app);

  app.listen(config.EXPRESS_PORT, () => console.log('Server up!'));
};
