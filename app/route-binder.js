/**
 * All the routes
 *
 * @param {object} schs Mongoose schemas
 * @param {object} passport Passport
 * @param {function} app Express.js application
 * @param {function} digester Digest generator
 * @param {function} salter Salt generating function
 */
module.exports = function(schs, passport, app, digester, salter) {
  let h = require('./controllers/helpers.js');

  let rc = require('./controllers/root.js')();
  let lc = require('./controllers/locations.js')(h, schs.Location);
  let ec = require('./controllers/events.js')(h, schs.Event);
  let uc = require('./controllers/users.js')(h, digester, salter, schs.User);

  let reqAuth = passport.authenticate('basic');

  app.get('/', rc.get);

  app.delete('/locations', reqAuth, lc.delete);
  app.delete('/locations/:id', reqAuth, lc.deleteById);
  app.get('/locations', lc.get);
  app.get('/locations/:id', lc.getById);
  app.get('/locations/:id/:field', lc.getFieldById);
  app.post('/locations', reqAuth, lc.post);

  app.delete('/events', reqAuth, ec.delete);
  app.delete('/events/:id', reqAuth, ec.deleteById);
  app.delete('/events/:id/calendar', reqAuth, ec.deleteFromCalendar);
  app.get('/events', ec.get);
  app.get('/events/:id', ec.getById);
  app.get('/events/:id/:field', ec.getFieldById);
  app.post('/events', reqAuth, ec.post);
  app.post('/events/:id/calendar', reqAuth, ec.postToCalendar);

  app.delete('/users', reqAuth, uc.delete);
  app.delete('/users/:id', reqAuth, uc.deleteById);
  app.get('/users', reqAuth, uc.get);
  app.get('/users/:id', uc.getById);
  app.get('/users/:id/:field', uc.getFieldById);
  app.post('/users', uc.post);

  // If path not found
  app.get('*', (_req, _res, next) => next(new Error('Bad path')));
};
