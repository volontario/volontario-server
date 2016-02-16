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
      LocationSchema.remove(query, function(error, obj) {
        if (error) {
          next(new Error());
        } else {
          res.status(obj.result.n > 0 ? 205 : 204).end();
        }
      });
    },

    deleteById: function(req, res, next) {
      LocationSchema.findByIdAndRemove(req.params.id, function(error) {
        if (!error) {
          res.status(204).end();
        } else if (error.name === 'CastError') {
          next(new Error('Bad resource ID'));
        } else {
          next(new Error());
        }
      });
    },

    get: function(req, res) {
      minerMaster.mine('blood-service-centres');

      LocationSchema.find(req.query, (_error, locs) => res.json(locs));
    },

    getById: function(req, res, next) {
      LocationSchema.findById(req.params.id, function(_error, loc) {
        return loc ? res.json(loc) : next(new Error('Location not found'));
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
      const requiredFields = [
        'category',
        'latitude',
        'longitude',
        'name',
        'url'
      ];

      const fieldError = helpers.requireFields(req, requiredFields);
      if (fieldError) {
        return next(fieldError);
      }

      // This is crappy and I admit it
      const location = new LocationSchema({
        category: req.body.category,
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        name: req.body.name,
        ownerId: req.user.id,
        url: req.body.url
      });

      location.save(function(error) {
        if (error) {
          next(new Error('Database error'));
        } else {
          res.status(201).end();
        }
      });
    }
  };
};
