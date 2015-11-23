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

    deleteById: function(req, res, next) {
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

      let desiredProperties = [
        'addedAt',
        'category',
        'coordinates',
        'id',
        'name',
        'origin',
        'originalId',
        'owner',
        'updatedAt',
        'url'
      ];

      EventSchema.find(req.query, function(_error, events) {
        let trimmedEvents = events.map(function(e) {
          return desiredProperties.reduce(function(incompleteEvent, property) {
            incompleteEvent[property] = e[property];
            return incompleteEvent;
          }, {});
        });

        return res.json(trimmedEvents);
      });
    },

    getById: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        return event ? res.json(event) : next(new Error('Event not found'));
      });
    },

    getFieldById: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          next(new Error('Event not found'));
        }

        let response = {};
        response[req.params.field] = event[req.params.field];
        return res.json(response);
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
    },

    postToCalendar: function(req, res, next) {
      let requiredFields = [
        'userId',
        'from',
        'to'
      ];

      let missingFields = requiredFields.reduce(function(mf, rf) {
        return req.query[rf] === undefined ? mf.concat(rf) : mf;
      }, []);

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        next(new Error(`Missing fields: ${missingFields}`));
        return;
      }

      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          next(new Error('Event not found'));
        }

        var updateableCalendar = event.calendar
        updateableCalendar.push({
          userId: req.query.userId,
          from: req.query.from,
          to: req.query.to
        });

        event.update({ calendar: updateableCalendar }).exec();
      });
    }
  };
};
