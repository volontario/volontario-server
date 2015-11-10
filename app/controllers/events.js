/**
 * Controllers for /events
 *
 * @param {object} schemas Mongoose schemas
 * @return {object} Routes per HTTP method
 */
module.exports = function(schemas) {
  var minerMaster = require('../miner-master.js');

  return {
    get: function(req, res) {
      minerMaster(schemas, 'toimintasuomi');
      schemas.Event.find(req.query, function(_err, events) {
        return res.json(events);
      });
    },
    post: function(req, res) {
      var requiredFields = [
        'latitude',
        'longitude',
        'name',
        'originalId',
        'url'
      ];

      var missingFields = requiredFields.reduce(function(mf, rf) {
        return req.body[rf] === undefined ? mf.concat(rf) : mf;
      }, []);

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        return res.json({missingFields: missingFields});
      }

      // This is crappy and I admit it
      var event = new schemas.Event({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        name: req.body.name,
        originalId: req.body.originalId,
        url: req.body.url
      });

      event.save(function(error) {
        return res.json({ok: !error});
      });
    }
  };
};
