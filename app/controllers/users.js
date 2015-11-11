/**
 * Controllers for /users
 *
 * @param {object} UserSchema Mongoose user schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(UserSchema) {
  return {
    get: function(req, res) {
      UserSchema.find(req.query, function(_error, users) {
        let bareUsers = users.map(function(u) {
          u._id = u.__v = undefined;
          return u;
        });

        res.json(bareUsers);
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
