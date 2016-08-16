/**
 * Route matching
 */
module.exports = function(config, schemas, helpers, passport, app) {
  const rc = require('./controllers/root.js')();
  const lc = require('./controllers/locations.js')(helpers, schemas);
  const ec = require('./controllers/events.js')(helpers, schemas);
  const uc = require('./controllers/users.js')(helpers, schemas);
  const ac = require('./controllers/auths.js')(config, passport);

  const auth = passport.authenticate('basic');

  // Root AKA ping
  app.get('/', rc.get);

  // Locations
  app.delete('/locations', auth, lc.delete);
  app.delete('/locations/:id', auth, lc.deleteById);
  app.get('/locations', lc.get);
  app.get('/locations/:id', lc.getById);
  app.get('/locations/:id/:field', lc.getFieldById);
  app.post('/locations', auth, lc.post);

  // Events
  app.delete('/events', auth, ec.delete);
  app.delete('/events/:id', auth, ec.deleteById);
  app.delete('/events/:eventId/calendar/:itemId', auth, ec.deleteFromCalendar);
  app.get('/events', ec.get);
  app.get('/events/:id', ec.getById);
  app.get('/events/:id/calendar', ec.getCalendar);
  app.get('/events/:id/:field', ec.getFieldById);
  app.patch('/events/:id', ec.patchField);
  app.post('/events', auth, ec.post);
  app.post('/events/:id/calendar', auth, ec.postToCalendar);

  // Users
  app.delete('/users', auth, uc.delete);
  app.delete('/users/:id', auth, uc.deleteById);
  app.get('/users', auth, uc.get);
  app.get('/users/me', auth, uc.getMe);
  app.get('/users/:id', uc.getById);
  app.get('/users/:id/events', uc.getEvents);
  app.get('/users/:id/:field', uc.getFieldById);
  app.post('/users', uc.post);

  // Authentication
  app.get('/auths/facebook', ac.facebookInit);
  app.get('/auths/facebook/callback', ac.facebookCallback);

  // If no matching handler is found
  app.get('*', (_req, _res, next) => next(new Error('Bad path')));
};
