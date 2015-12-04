/**
 * Controllers for /events
 *
 * @param {object} helpers Controller helpers
 * @param {object} EventSchema Mongoose event schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(helpers, EventSchema) {
  let minerMaster = require('../mining/master.js')(EventSchema);

  return {
    delete: function(req, res, next) {
      let flagError = helpers.requireNotVagueFlag(req);
      if (flagError) {
        return next(flagError);
      }

      let query = req.body;
      EventSchema.remove(query, function(error, obj) {
        if (error) {
          next(new Error());
        } else {
          res.status(obj.result.n > 0 ? 205 : 204).send();
        }
      });
    },

    deleteById: function(req, res, next) {
      EventSchema.findByIdAndRemove(req.params.id, function(error) {
        if (!error) {
          res.status(204).send();
        } else if (error.name === 'CastError') {
          next(new Error('Bad resource ID'));
        } else {
          next(new Error());
        }
      });
    },

    deleteFromCalendar: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        event.calendar = event.calendar.filter(function(item) {
          return item._id.toString() !== req.body.id;
        });

        event.save(function(error) {
          if (error) {
            next(new Error('Database error'));
          } else {
            res.status(204).send();
          }
        });
      });
    },

    get: function(req, res) {
      minerMaster.mine('toimintasuomi');

      let keptProperties = [
        'addedAt',
        'category',
        'coordinates',
        'id',
        'name',
        'origin',
        'originalId',
        'ownerId',
        'updatedAt',
        'url'
      ];

      EventSchema.find(req.query, function(_error, events) {
        return res.json(events.map(function(e) {
          return helpers.dropExcludedProperties(keptProperties, e);
        }));
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
          return next(new Error('Event not found'));
        }

        let response = {};
        response[req.params.field] = event[req.params.field];
        return res.json(response);
      });
    },

    post: function(req, res, next) {
      let requiredFields = [
        'category',
        'latitude',
        'longitude',
        'name',
        'origin',
        'originalId',
        'url'
      ];

      let fieldError = helpers.requireFields(req, requiredFields);
      if (fieldError) {
        return next(fieldError);
      }

      // This is crappy and I admit it
      let event = new EventSchema({
        category: req.body.category,
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        name: req.body.name,
        origin: req.body.origin,
        originalId: req.body.originalId,
        ownerId: req.user.id,
        url: req.body.url
      });

      event.save(function(error) {
        if (error) {
          next(new Error('Database error'));
        } else {
          res.status(201).send();
        }
      });
    },

    postToCalendar: function(req, res, next) {
      let requiredFields = [
        'userId',
        'from',
        'to'
      ];

      let fieldError = helpers.requireFields(req, requiredFields);
      if (fieldError) {
        return next(fieldError);
      }

      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        var updateableCalendar = event.calendar;
        updateableCalendar.push({
          userId: req.body.userId,
          from: req.body.from,
          to: req.body.to
        });

        event.update({calendar: updateableCalendar}, null, function(error) {
          if (error) {
            next(new Error('Database error'));
          } else {
            res.status(201).send();
          }
        });
      });
    }
  };
};
