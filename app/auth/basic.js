module.exports = function(
  passport,
  Strategy,
  FBStrategy,
  digester,
  UserSchema
) {
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

    UserSchema.findOne({email: providedEmail}, function(error, user) {
      if (error) {
        return done(new Error('Database error'));
      }

      if (!user) {
        return done(new Error('Authentication failed'));
      }

      const digest = digester(providedPassword, user.salt);
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
    UserSchema.findOne({facebookId: profile.id}, function(error, user) {
      if (error) {
        return done(error);
      }

      if (user) {
        return done(null, user);
      }

      console.log(profile);

      const newUser = new UserSchema({
        coordinates: {
          latitude: 0,
          longitude: 0
        },
        dateOfBirth: new Date('1980-01-01'),
        email: profile.email,
        givenName: profile.name.givenName,
        facebookId: profile.id,
        familyName: profile.name.familyName,
        phoneNumber: '+358504911000'
      });

      newUser.save(function(error) {
        if (error) {
          return done(error);
        }

        return done(null, newUser);
      });
    });
  }));
};
