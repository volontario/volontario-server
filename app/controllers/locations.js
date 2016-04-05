/**
 * Controllers for /locations
 *
 * @param {object} helpers Controller helpers
 * @param {object} LocationSchema Mongoose location schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(helpers, LocationSchema) {
  const minerMaster = require('../mining/master.js')(LocationSchema);

  return {
    delete: function(req, res, next) {
      const flagError = helpers.requireNotVagueFlag(req);
      if (flagError) {
        return next(flagError);
      }

      const query = req.body;
      LocationSchema.find(query, function(error, locations) {
        if (error) {
          return next(new Error());
        }

        const deletedN = locations.reduce(function(dN, location) {
          if (!helpers.isOwnerOrTheirAncestor(req.user, location)) {
            return dN;
          }

          location.remove().exec();
          return dN + 1;
        }, 0);

        res.status(deletedN > 0 ? 205 : 204).end();
      });
    },

    deleteById: function(req, res, next) {
      LocationSchema.findById(req.params.id, function(error, location) {
        if (!helpers.isOwnerOrTheirAncestor(req.user, location)) {
          return res.status(403).end();
        }

        if (error && error.name === 'CastError') {
          return next(new Error('Bad resource ID'));
        } else if (error) {
          return next(new Error());
        }

        location.remove().exec();
        res.status(205).end();
      });
    },

    get: function(req, res) {
      minerMaster.mine('blood-service-centres');

      LocationSchema.find(req.query.filters, function(_error, locs) {
        return res.json(locs);
      });
    },

    getById: function(req, res, next) {
      LocationSchema.findById(req.params.id, function(_error, location) {
        if (!location) {
          return next(new Error('Location not found'));
        }

        return res.json(location);
      });
    },

    getFieldById: function(req, res, next) {
      LocationSchema.findById(req.params.id, function(_error, location) {
        if (!location) {
          return next(new Error('Location not found'));
        }

        let response = {};
        response[req.params.field] = location[req.params.field];
        return res.json(response);
      });
    },

    post: function(req, res, next) {
      // This is crappy and I admit it
      const location = new LocationSchema({
        category: req.body.category,
        coordinates: {
          latitude: req.body.coordinates.latitude,
          longitude: req.body.coordinates.longitude
        },
        name: req.body.name,
        ownerId: req.user.id,
        url: req.body.url
      });

      location.save(function(error) {
        if (error) {
          return next(helpers.decorateError(error));
        }

        return res.status(201).json({id: location.id});
      });
    }
  };
};
