/**
 * Controllers for /users
 *
 * @param {object} helpers Controller helpers
 * @param {object} digester Digest generator
 * @param {function} salter Salt generating function
 * @param {object} schemas Mongoose user schemas
 * @return {object} Routes per HTTP method
 */
module.exports = function(helpers, digester, salter, schemas) {
  const UserSchema = schemas.User;

  return {
    delete: function(req, res, next) {
      const flagError = helpers.requireNotVagueFlag(req);
      if (flagError) {
        return next(flagError);
      }

      const query = req.body;
      UserSchema.remove(query, function(error, obj) {
        if (error) {
          next(new Error());
        } else {
          res.status(obj.result.n > 0 ? 205 : 204).send();
        }
      });
    },

    deleteById: function(req, res, next) {
      UserSchema.findByIdAndRemove(req.params.id, function(error) {
        if (!error) {
          res.status(204).send();
        } else if (error.name === 'CastError') {
          next(new Error('Bad resource ID'));
        } else {
          next(new Error());
        }
      });
    },

    get: function(req, res) {
      UserSchema.find(req.query, function(_error, users) {
        const keptProperties = [
          'dateOfBirth',
          'email',
          'familyName',
          'givenName',
          'id',
          'owner',
          'phoneNumber',
          'tags'
        ];

        return res.json(users.map(function(u) {
          return helpers.dropExcludedProperties(keptProperties, u);
        }));
      });
    },

    getById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(_error, user) {
        return user ? res.json(user) : next(new Error('User not found'));
      });
    },

    getEvents: function(req, res) {
      const query = {'calendar.userId': req.params.id};
      schemas.Event.find(query, function(_error, events) {
        return res.json(events);
      });
    },

    getFieldById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(_error, user) {
        if (!user) {
          return next(new Error('User not found'));
        }

        let response = {};
        response[req.params.field] = user[req.params.field];
        return res.json(response);
      });
    },

    post: function(req, res, next) {
      const requiredFields = [
        'dateOfBirth',
        'email',
        'familyName',
        'givenName',
        'latitude',
        'longitude',
        'password',
        'phoneNumber',
        'tags'
      ];

      const fieldError = helpers.requireFields(req, requiredFields);
      if (fieldError) {
        return next(fieldError);
      }

      const salt = salter();
      const digest = digester(req.body.password, salt);

      // This is crappy and I admit it
      const user = new UserSchema({
        dateOfBirth: new Date(req.body.dateOfBirth),
        digest: digest,
        email: req.body.email,
        familyName: req.body.familyName,
        givenName: req.body.givenName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        phoneNumber: req.body.phoneNumber,
        salt: salt,
        tags: req.body.tags
      });

      user.save(function(error) {
        if (error) {
          next(new Error('Database error'));
        } else {
          res.status(201).send();
        }
      });
    }
  };
};
