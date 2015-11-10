/**
 * Controllers for /locations
 *
 * @param {object} schemas Mongoose schemas
 * @return {object} Routes per HTTP method
 */
module.exports = function(schemas) {
  return {
    get: function(req, res) {
      schemas.Location.find(req.query, function(_error, locations) {
        let strippedLocations = locations.map(function(loc) {
          loc._id = loc.__v = undefined;
          return loc;
        });

        return res.json(strippedLocations);
      });
    },

    post: function(req, res) {
      let requiredFields = [
        'category',
        'latitude',
        'longitude',
        'title',
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
      let location = new schemas.Location({
        category: req.body.category,
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        title: req.body.title,
        url: req.body.url
      });

      location.save(error => res.json({ok: !error}));
    }
  };
};
