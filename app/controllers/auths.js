/**
 * Controllers for /auths
 *
 * @param {object} passport Passport
 * @return {object} Routes per HTTP method
 */
module.exports = function(passport) {
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

          const isQuasi =
            user.constructor.modelName === 'quasiuser' ? 'true' : 'false';

          const host = 'http://localhost:8100';

          return res.redirect(`${host}?id=${user.id}&quasi=${isQuasi}`);
        });
      })(req, res, next);
    },

    facebookInit: passport.authenticate('facebook', {scope: 'email'})
  };
};
