/**
 * Controllers for /users
 *
 * @param {object} UserSchema Mongoose user schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(UserSchema) {
  return {
    delete: function(req, res, next) {
      let query;
      if (req.body.notVague === 'true') {
        query = {};
      } else if (Object.getOwnPropertyNames(req.body).length === 0) {
        next(new Error('Possibly too vague: use notVague=true to enforce'));
        return;
      } else {
        query = req.body;
      }

      UserSchema.remove(query, function(error) {
        if (error) {
          next(new Error());
        } else {
          res.status(200).send();
        }
      });
    },

    deleteByID: function(req, res, next) {
      UserSchema.findByIdAndRemove(req.params.id, function(error) {
        if (!error) {
          res.status(200).send();
        } else if (error.name === 'CastError') {
          next(new Error('Bad resource ID'));
        } else {
          next(new Error());
        }
      });
    },

    get: function(req, res) {
      UserSchema.find(req.query, (_error, users) => res.json(users));
    },

    getByID: function(req, res, next) {
      UserSchema.findById(req.params.id, function(_error, user) {
        return user ? res.json(user) : next(new Error('User not found'));
      });
    },

    post: function(req, res, next) {
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
        next(new Error(`Missing fields: ${missingFields}`));
        return;
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
