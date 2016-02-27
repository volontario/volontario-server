/**
 * Controllers for /events
 *
 * @param {object} helpers Controller helpers
 * @param {object} EventSchema Mongoose event schema
 * @return {object} Routes per HTTP method
 */
module.exports = function(helpers, EventSchema) {
  const minerMaster = require('../mining/master.js')(EventSchema);

  return {
    delete: function(req, res, next) {
      const flagError = helpers.requireNotVagueFlag(req);
      if (flagError) {
        return next(flagError);
      }

      const query = req.body;
      EventSchema.remove(query, function(error, obj) {
        if (error) {
          next(new Error());
        } else {
          res.status(obj.result.n > 0 ? 205 : 204).end();
        }
      });
    },

    deleteById: function(req, res, next) {
      EventSchema.findByIdAndRemove(req.params.id, function(error) {
        if (!error) {
          res.status(205).end();
        } else if (error.name === 'CastError') {
          next(new Error('Bad resource ID'));
        } else {
          next(new Error());
        }
      });
    },

    deleteFromCalendar: function(req, res, next) {
      EventSchema.findById(req.params.eventId, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        const newCalendar = event.calendar.filter(function(item) {
          return item._id.toString() !== req.params.itemId;
        });

        if (event.calendar.length === newCalendar.length) {
          return next(new Error('Calendar item not found'));
        }

        event.calendar = newCalendar;

        event.save(function(error) {
          if (error) {
            next(new Error('Database error'));
          } else {
            res.status(205).end();
          }
        });
      });
    },

    get: function(req, res) {
      minerMaster.mine('toimintasuomi');

      EventSchema.find(req.query.filters, function(_error, events) {
        res.json(events);
      });
    },

    getWithBody: function(req, res, next) {
      EventSchema.find(req.body.filters, function(_error, events) {
        if (req.body.sort && req.body.sort.by === 'distance') {
          if (!req.body.sort.latitude) {
            return next(new Error('Missing fields: latitude'));
          }

          if (!req.body.sort.longitude) {
            return next(new Error('Missing fields: longitude'));
          }

          events.forEach(function(e) {
            e.distance = helpers.calculateDistanceBetween(
              req.body.sort.latitude,
              req.body.sort.longitude,
              e.coordinates.latitude,
              e.coordinates.longitude
            );
          });

          events.sort((a, b) => a.distance - b.distance);
        }

        return res.json(events);
      });
    },

    getById: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        return res.json(event);
      });
    },

    getCalendar: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        // Just the plain calendar -- this is default behavior for /:field
        if (!req.query.options || req.query.options.inverted !== 'true') {
          // Force the event to JSON to call its schema's .toJSON()
          const jsonEvent = event.toJSON();
          return res.json(jsonEvent.calendar);
        }

        if (event.startsAt === undefined || event.endsAt === undefined) {
          return next(
            new Error('Impossible: either startsAt or endsAt is not defined')
          );
        }

        /**
         * Magic
         */
        const freeIntervals = (function(e) {
          let points = [];
          const maxUsers = 1;
          let curUsers = 0;

          points.push({
            userChange: u => u,
            time: e.startsAt
          });

          points.push({
            userChange: u => u,
            time: e.endsAt
          });

          e.calendar.forEach(function(userTime) {
            points.push({
              userChange: u => u + 1,
              time: userTime.from
            });

            points.push({
              userChange: u => u - 1,
              time: userTime.to
            });
          });

          points.sort((a, b) => a.time.valueOf() > b.time.valueOf() ? 1 : -1);

          let openInterval = {};
          let freeIntervals = [];
          for (let i = 0; i < points.length; i += 1) {
            curUsers = points[i].userChange(curUsers);

            if ((curUsers >= maxUsers || i === points.length - 1) &&
                openInterval.to === undefined) {
              openInterval.to = points[i].time;
              freeIntervals.push(openInterval);
              openInterval = {};
            } else if (openInterval.from === undefined) {
              openInterval.from = points[i].time;
            }
          }

          return freeIntervals;
        })(event);

        return res.json(freeIntervals);
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

    patchField: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        if (req.body.op !== 'replace') {
          return next(new Error('Unsupported operation'));
        }

        const field = req.body.path.substring(1);
        event[field] = req.body.value;

        event.save(function(error) {
          if (error) {
            next(new Error('Database error'));
          } else {
            res.status(204).end();
          }
        });
      });
    },

    post: function(req, res, next) {
      // This is crappy and I admit it
      const event = new EventSchema({
        category: req.body.category,
        endsAt: (req.body.endsAt || undefined),
        name: req.body.name,
        origin: (req.body.origin || undefined),
        originalId: (req.body.originalId || undefined),
        ownerId: req.user.id,
        locationId: req.body.locationId,
        startsAt: (req.body.startsAt || undefined),
        url: (req.body.url || undefined)
      });

      event.save(function(error) {
        if (error) {
          return next(helpers.decorateError(error));
        }

        res.status(201).json({id: event.id});
      });
    },

    postToCalendar: function(req, res, next) {
      const requiredFields = [
        'userId',
        'from',
        'to'
      ];

      const fieldError = helpers.requireFields(req, requiredFields);
      if (fieldError) {
        return next(fieldError);
      }

      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        var updateableCalendar = event.calendar;
        updateableCalendar.push({
          hostApproved: false,
          from: req.body.from,
          to: req.body.to,
          userApproved: true,
          userId: req.body.userId
        });

        event.locationId = 'test';

        event.save(function(error) {
          if (error) {
            next(new Error('Database error'));
          } else {
            const newItem = updateableCalendar.reduce(function(newest, item) {
              return item.addedAt > newest.addedAt ? item : newest;
            });
            res.status(201).json({id: newItem.id});
          }
        });
      });
    }
  };
};
