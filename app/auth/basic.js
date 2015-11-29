module.exports = function(passport, Strategy, digester, UserSchema) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new Strategy(function(providedEmail, providedPassword, done) {
    if (providedEmail === '' && providedPassword === '') {
      return done(true);
    }

    UserSchema.findOne({email: providedEmail}, function(error, user) {
      if (error) {
        return done(new Error('Database error'));
      }

      if (!user) {
        return done(new Error('Authentication failed'));
      }

      let digest = digester(providedPassword, user.salt);
      if (digest !== user.digest) {
        return done(new Error('Authentication failed'));
      }

      return done(null, user);
    });
  }));
};
