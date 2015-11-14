/**
 * All the routes
 *
 * @param {object} m Mongoose connection
 * @param {function} app Express.js application
 */
module.exports = function(m, app) {
  let rc = require('../controllers/root.js')();
  let lc = require('../controllers/locations.js')(m.schemas.Location);
  let ec = require('../controllers/events.js')(m.schemas.Event);
  let uc = require('../controllers/users.js')(m.schemas.User);

  app.get('/', rc.get);

  app.delete('/locations', lc.delete);
  app.delete('/locations/:id', lc.deleteByID);
  app.get('/locations', lc.get);
  app.get('/locations/:id', lc.getByID);
  app.post('/locations', lc.post);

  app.delete('/events', ec.delete);
  app.delete('/events/:id', ec.deleteByID);
  app.get('/events', ec.get);
  app.get('/events/:id', ec.getByID);
  app.post('/events', ec.post);

  app.delete('/users', uc.delete);
  app.delete('/users/:id', uc.deleteByID);
  app.get('/users', uc.get);
  app.get('/users/:id', uc.getByID);
  app.post('/users', uc.post);

  // If path not found
  app.get('*', (_req, _res, next) => next(new Error('Bad path')));
};
