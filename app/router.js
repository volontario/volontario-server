/**
 * Route matching
 *
 * @param {object} schemas Mongoose schemas
 * @param {object} helpers Controller helpers
 * @param {object} passport Passport
 * @param {function} app Express.js application
 */
module.exports = function(schemas, helpers, passport, app) {
  const rc = require('./controllers/root.js')();
  const lc = require('./controllers/locations.js')(helpers, schemas);
  const ec = require('./controllers/events.js')(helpers, schemas);
  const uc = require('./controllers/users.js')(helpers, schemas);

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

  // oAuth
  app.get(
    '/auths/facebook',
    passport.authenticate('facebook', {scope: 'email'})
  );

  app.get('/auths/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user) {
      if (err) {
        return next(err);
      }

      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }

        const isQuasi =
          user.constructor.modelName === 'quasiuser' ? 'true' : 'false';

        const host = 'http://localhost:8100';

        return res.redirect(`${host}?id=${user.id}&quasi=${isQuasi}`);
      });
    })(req, res, next);
  });

  // If no matching handler is found
  app.get('*', (_req, _res, next) => next(new Error('Bad path')));
};
