/**
 * All the routes
 *
 * @param {object} m Mongoose connection
 * @param {object} passport Passport
 * @param {function} app Express.js application
 * @param {function} digester Digest generator
 * @param {function} salter Salt generating function
 */
module.exports = function(m, passport, app, digester, salter) {
  let rc = require('../controllers/root.js')();
  let lc = require('../controllers/locations.js')(m.schemas.Location);
  let ec = require('../controllers/events.js')(m.schemas.Event);
  let uc = require('../controllers/users.js')(digester, salter, m.schemas.User);

  let reqAuth = passport.authenticate('basic');

  app.get('/', rc.get);

  app.delete('/locations', lc.delete);
  app.delete('/locations/:id', lc.deleteById);
  app.get('/locations', lc.get);
  app.get('/locations/:id', lc.getById);
  app.get('/locations/:id/:field', lc.getFieldById);
  app.post('/locations', lc.post);

  app.delete('/events', ec.delete);
  app.delete('/events/:id', ec.deleteById);
  app.delete('/events/:id/calendar', ec.deleteFromCalendar);
  app.get('/events', ec.get);
  app.get('/events/:id', ec.getById);
  app.get('/events/:id/:field', ec.getFieldById);
  app.post('/events', ec.post);
  app.post('/events/:id/calendar', ec.postToCalendar);

  app.delete('/users', uc.delete);
  app.delete('/users/:id', uc.deleteById);
  app.get('/users', reqAuth, uc.get);
  app.get('/users/:id', uc.getById);
  app.get('/users/:id/:field', uc.getFieldById);
  app.post('/users', uc.post);

  // If path not found
  app.get('*', (_req, _res, next) => next(new Error('Bad path')));
};
