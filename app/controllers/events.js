/**
 * Controllers for /events
 *
 * @param {object} EventSchema Mongoose event schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(EventSchema) {
  let minerMaster = require('../mining/master.js')(EventSchema);

  return {
    deleteByID: function(req, res) {
      EventSchema.findByIdAndRemove(req.params.id, function(error) {
        res.json({ok: !error});
      });
    },

    get: function(req, res) {
      minerMaster.mine('toimintasuomi');

      EventSchema.find(req.query, (_error, events) => res.json(events));
    },

    getByID: function(req, res) {
      EventSchema.findById(req.params.id, function(_error, event) {
        return event ? res.json(event) : res.json({});
      });
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
      let event = new EventSchema({
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
