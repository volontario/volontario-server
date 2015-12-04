/**
 * Controllers for /locations
 *
 * @param {object} LocationSchema Mongoose location schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(LocationSchema) {
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

      LocationSchema.remove(query, function(error) {
        if (error) {
          next(new Error());
        } else {
          res.status(200).send();
        }
      });
    },

    deleteById: function(req, res, next) {
      LocationSchema.findByIdAndRemove(req.params.id, function(error) {
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
          next(new Error('Location not found'));
        }

        let response = {};
        response[req.params.field] = location[req.params.field];
        return res.json(response);
      });
    },

    post: function(req, res, next) {
      let requiredFields = [
        'category',
        'latitude',
        'longitude',
        'name',
        'url'
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
      let location = new LocationSchema({
        category: req.body.category,
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        name: req.body.name,
        url: req.body.url
      });

      location.save(error => res.json({ok: !error}));
    }
  };
};
