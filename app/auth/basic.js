module.exports = function(passport, Strategy, UserSchema) {
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

      console.log(hash);
      hash(providedPassword, user.salt, function(error, digest) {
        if (error || digest !== user.digest) {
          return done(new Error('Authentication failed'));
        }

        return done(null, user);
      });
    });
  }));
};
