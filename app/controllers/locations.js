/**
 * Controllers for /locations
 *
 * @param {object} LocationSchema Mongoose location schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(LocationSchema) {
  return {
    deleteByID: function(req, res) {
      LocationSchema.findByIdAndRemove(req.params.id, function(error) {
        res.json({ok: !error});
      });
    },

    get: function(req, res) {
      LocationSchema.find(req.query, (_error, locs) => res.json(locs));
    },

    getByID: function(req, res) {
      LocationSchema.findById(req.params.id, function(_error, loc) {
        return loc ? res.json(loc) : res.json({});
      });
    },

    post: function(req, res) {
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
        return res.json({missingFields: missingFields});
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
