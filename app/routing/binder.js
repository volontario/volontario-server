/**
 * All the routes
 *
 * @param {object} m Mongoose connection
 * @param {function} app Express.js application
 */
module.exports = function(m, app) {
  let rc = require('../controllers/root.js')();
  let lc = require('../controllers/locations.js')(m.schemas);
  let ec = require('../controllers/events.js')(m.schemas);
  let uc = require('../controllers/users.js')(m.schemas);

  app.get('/', rc.get);

  app.get('/locations', lc.get);
  app.post('/locations', lc.post);

  app.get('/events', ec.get);
  app.post('/events', ec.post);

  app.get('/users', uc.get);
  app.post('/users', uc.post);
};
