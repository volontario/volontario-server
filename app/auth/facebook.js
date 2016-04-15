module.exports = function(passport, Strategy, schemas, config) {
  passport.use(new Strategy({
    clientID: config.FACEBOOK_AUTH_ID,
    clientSecret: config.FACEBOOK_AUTH_SECRET,
    callbackURL: config.FACEBOOK_AUTH_CALLBACK
  }, function(token, refreshToken, profile, done) {
    schemas.User.findOne({facebookId: profile.id}, function(error, user) {
      if (error) {
        return done(error);
      }

      if (user) {
        return done(null, user);
      }

      const newQuasiuser = new schemas.Quasiuser({
        externalIds: {facebook: profile.id}
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
