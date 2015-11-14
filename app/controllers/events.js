/**
 * Controllers for /events
 *
 * @param {object} EventSchema Mongoose event schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(EventSchema) {
  let minerMaster = require('../mining/master.js')(EventSchema);

  return {
    delete: function(req, res, next) {
      if (Object.getOwnPropertyNames(req.body).length === 0 &&
          req.body.notVague !== 'true') {
        next(new Error('Possibly too vague: use notVague=true to enforce'));
        return;
      }

      EventSchema.remove(req.body, function(error) {
        if (error) {
          next(new Error());
        } else {
          res.status(200).send();
        }
      });
    },

    deleteByID: function(req, res, next) {
      EventSchema.findByIdAndRemove(req.params.id, function(error) {
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
      minerMaster.mine('toimintasuomi');

      EventSchema.find(req.query, (_error, events) => res.json(events));
    },

    getByID: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        return event ? res.json(event) : next(new Error('Event not found'));
      });
    },

    post: function(req, res, next) {
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
        next(new Error(`Missing fields: ${missingFields}`));
        return;
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
