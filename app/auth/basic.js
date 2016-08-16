module.exports = function(passport, schemas) {
  const Strategy = require('passport-http').BasicStrategy;
  const helpers = require('./helpers.js');

  passport.use(new Strategy(function(providedEmail, providedPassword, done) {
    if (providedEmail === '' || providedPassword === '') {
      return done(true);
    }

    schemas.User.findOne({email: providedEmail}, function(error, user) {
      if (error) {
        return done(new Error('Database error'));
      }

      if (!user) {
        return done(new Error('Authentication failed'));
      }

      const digest = helpers.digest(providedPassword, user.salt);
      if (digest !== user.digest) {
        return done(new Error('Authentication failed'));
      }

      return done(null, user);
    });
  }));
};
