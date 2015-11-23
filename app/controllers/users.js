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
      if (req.query.notVague === 'true') {
        query = {};
      } else if (Object.getOwnPropertyNames(req.query).length === 0) {
        next(new Error('Possibly too vague: use notVague=true to enforce'));
        return;
      } else {
        query = req.query;
      }

      UserSchema.remove(query, function(error) {
        if (error) {
          next(new Error());
        } else {
          res.status(200).send();
        }
      });
    },

    deleteById: function(req, res, next) {
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

    getById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(_error, user) {
        return user ? res.json(user) : next(new Error('User not found'));
      });
    },

    getFieldById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(_error, user) {
        if (!user) {
          next(new Error('User not found'));
        }

        let response = {};
        response[req.params.field] = user[req.params.field];
        return res.json(response);
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
        return req.query[rf] === undefined ? mf.concat(rf) : mf;
      }, []);

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        next(new Error(`Missing fields: ${missingFields}`));
        return;
      }

      // This is crappy and I admit it
      let user = new UserSchema({
        dateOfBirth: new Date(req.query.dateOfBirth),
        familyName: req.query.familyName,
        givenName: req.query.givenName,
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        email: req.query.email,
        phoneNumber: req.query.phoneNumber,
        tags: req.query.tags.split(',')
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
