/**
 * Controllers for /users
 *
 * @param {object} UserSchema Mongoose user schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(UserSchema) {
  return {
    deleteByID: function(req, res) {
      UserSchema.findByIdAndRemove(req.params.id, function(error) {
        res.json({ok: !error});
      });
    },

    get: function(req, res) {
      UserSchema.find(req.query, (_error, users) => res.json(users));
    },

    getByID: function(req, res) {
      UserSchema.findById(req.params.id, function(_error, user) {
        return user ? res.json(user) : res.json({});
      });
    },

    post: function(req, res) {
      let requiredFields = [
        'dateOfBirth',
        'familyName',
        'givenName',
        'latitude',
        'longitude',
        'email',
        'phoneNumber',
        'tags'
      ];

      let missingFields = requiredFields.reduce(function(mf, rf) {
        return req.body[rf] === undefined ? mf.concat(rf) : mf;
      }, []);

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        return res.json({missingFields: missingFields});
      }

      // This is crappy and I admit it
      let user = new UserSchema({
        dateOfBirth: new Date(req.body.dateOfBirth),
        familyName: req.body.familyName,
        givenName: req.body.givenName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        tags: req.body.tags.split(',')
      });

      user.save(function(error) {
        if (error) {
          return res.json({
            ok: false,
            error: !error
          });
        }

        return res.json({ok: true});
      });
    }
  };
};
