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
      let query;
      if (req.query.notVague === 'true') {
        query = {};
      } else if (Object.getOwnPropertyNames(req.query).length === 0) {
        next(new Error('Possibly too vague: use notVague=true to enforce'));
        return;
      } else {
        query = req.query;
      }

      EventSchema.remove(query, function(error) {
        if (error) {
          next(new Error());
        } else {
          res.status(200).send();
        }
      });
    },

    deleteByID: function(req, res, next) {
      EventSchema.findByIdAndRemove(req.query.id, function(error) {
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
      EventSchema.findById(req.query.id, function(_error, event) {
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
        return req.query[rf] === undefined ? mf.concat(rf) : mf;
      }, []);

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        next(new Error(`Missing fields: ${missingFields}`));
        return;
      }

      // This is crappy and I admit it
      let event = new EventSchema({
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        name: req.query.name,
        originalId: req.query.originalId,
        url: req.query.url
      });

      event.save(error => res.json({ok: !error}));
    }
  };
};
