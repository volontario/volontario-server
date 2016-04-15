module.exports = function(passport, Strategy, schemas, helpers) {
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
