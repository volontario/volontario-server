/**
 * Controllers for /users
 *
 * @param {object} schemas Mongoose schemas
 * @return {object} Routes per HTTP method
 */
module.exports = function(schemas) {
  return {
    get: function(req, res) {
      schemas.User.find(req.query, function(_err, users) {
        return res.json(users);
      });
    },
    post: function(req, res) {
      var requiredFields = [
        'dateOfBirth',
        'familyName',
        'givenName',
        'latitude',
        'longitude',
        'email',
        'phoneNumber',
        'tags'
      ];

      var missingFields = requiredFields.reduce(function(mf, rf) {
        return req.body[rf] === undefined ? mf.concat(rf) : mf;
      }, []);

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        return res.json({missingFields: missingFields});
      }

      // This is crappy and I admit it
      var user = new schemas.User({
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
