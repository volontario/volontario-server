/**
 * Controllers for /users
 *
 * @param {object} helpers Controller helpers
 * @param {object} schemas Mongoose user schemas
 * @return {object} Routes per HTTP method
 */
module.exports = function(helpers, schemas) {
  const UserSchema = schemas.User;

  return {
    delete: function(req, res, next) {
      const flagError = helpers.requireNotVagueFlag(req);
      if (flagError) {
        return next(flagError);
      }

      const query = req.body;
      UserSchema.find(query, function(err, users) {
        if (err) {
          return next(new Error('Database error'));
        }

        const deletedN = users.reduce(function(dN, user) {
          if (!helpers.isOwnerOrTheirAncestor(req.user, user)) {
            return dN;
          }

          user.remove().exec();
          return dN + 1;
        }, 0);

        res.status(deletedN > 0 ? 205 : 204).end();
      });
    },

    deleteById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(err, user) {
        if (!helpers.isOwnerOrTheirAncestor(req.user, user)) {
          return res.status(403).end();
        }

        if (err && err.name === 'CastError') {
          return next(new Error('Bad resource ID'));
        } else if (err) {
          return next(new Error('Database error'));
        }

        user.remove().exec();
        res.status(205).end();
      });
    },

    get: function(req, res, next) {
      UserSchema.find(req.query.filters, function(err, users) {
        if (err) {
          return next(new Error('Database error'));
        }

        users.forEach(u => u.tidy());

        return res.json(users);
      });
    },

    getMe: function(req, res) {
      const me = req.user;
      me.tidy();
      return res.json(me);
    },

    getById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(err, user) {
        if (err) {
          return next(new Error('Database error'));
        }

        if (!user) {
          return next(new Error('User not found'));
        }

        user.tidy();
        return res.json(user);
      });
    },

    getEvents: function(req, res, next) {
      const query = {'calendar.userId': req.params.id};
      schemas.Event.find(query, function(err, events) {
        if (err) {
          return next(new Error('Database error'));
        }

        return res.json(events);
      });
    },

    getFieldById: function(req, res, next) {
      UserSchema.findById(req.params.id, function(err, user) {
        if (err) {
          return next(new Error('Database error'));
        }

        if (!user) {
          return next(new Error('User not found'));
        }

        user.tidy();

        let response = {};
        response[req.params.field] = user[req.params.field];
        return res.json(response);
      });
    },

    post: function(req, res, next) {
      const salt = helpers.generateSalt();
      const digest = helpers.digest(req.body.password, salt);

      // This is crappy and I admit it
      const user = new UserSchema({
        coordinates: {
          latitude: req.body.coordinates.latitude,
          longitude: req.body.coordinates.longitude
        },
        dateOfBirth: new Date(req.body.dateOfBirth),
        digest: digest,
        email: req.body.email,
        familyName: req.body.familyName,
        givenName: req.body.givenName,
        phoneNumber: req.body.phoneNumber,
        salt: salt,
        tags: req.body.tags
      });

      user.save(function(err) {
        if (err) {
          return next(helpers.decorateError(err));
        }

        res.status(201).json({id: user.id});
      });
    }
  };
};
