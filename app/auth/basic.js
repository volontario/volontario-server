module.exports = function(passport, Strategy, FBStrategy, schemas, helpers) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

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

  passport.use(new FBStrategy({
    clientID: 194982844214187,
    clientSecret: 'c85bb18cfb4d19878729e0ca62d62f92',
    callbackURL: 'http://alivje.com:8080/oauth/callbacks/facebook'
  }, function(token, refreshToken, profile, done) {
    console.log('1');
    schemas.User.findOne({facebookId: profile.id}, function(error, user) {
      if (error) {
        return done(error);
      }

      if (user) {
        return done(null, user);
      }

      const newQuasiuser = new schemas.Quasiuser({
        facebookId: profile.id
      });

      newQuasiuser.save(function(error) {
        if (error) {
          return done(error);
        }

        return done(null, newQuasiuser);
      });
    });
  }));
};
