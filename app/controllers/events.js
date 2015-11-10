/**
 * Controllers for /events
 *
 * @param {object} schemas Mongoose schemas
 * @return {object} Routes per HTTP method
 */
module.exports = function(schemas) {
  let minerMaster = require('../miner-master.js')(schemas);

  return {
    get: function(req, res) {
      minerMaster.mine('toimintasuomi');
      schemas.Event.find(req.query, (_error, events) => res.json(events));
    },
    post: function(req, res) {
      let requiredFields = [
        'latitude',
        'longitude',
        'name',
        'originalId',
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
      let event = new schemas.Event({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        name: req.body.name,
        originalId: req.body.originalId,
        url: req.body.url
      });

      event.save(error => res.json({ok: !error}));
    }
  };
};
