/**
 * Controllers for /auths
 */
module.exports = function(config, passport) {
  return {
    facebookCallback: function(req, res, next) {
      passport.authenticate('facebook', function(err, user) {
        if (err) {
          return next(err);
        }

        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }

          const url = config.AUTH_CALLBACK;

          return res.redirect(`${url}?quasiuserId=${user.id}`);
        });
      })(req, res, next);
    },

    facebookInit: passport.authenticate('facebook', {scope: 'email'})
  };
};
