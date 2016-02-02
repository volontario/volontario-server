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

      const keptProperties = [
        'addedAt',
        'category',
        'coordinates',
        'endsAt',
        'id',
        'name',
        'origin',
        'originalId',
        'ownerId',
        'updatedAt',
        'startsAt',
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

    getCalendar: function(req, res, next) {
      EventSchema.findById(req.params.id, function(_error, event) {
        if (!event) {
          return next(new Error('Event not found'));
        }

        if (req.query.inverted !== 'true') {
          // Just the plain calender -- this is normal behavior from /:field
          return res.json(event.calendar);
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
            res.status(204).send();
          }
        });
      });
    },

    post: function(req, res, next) {
      const requiredFields = [
        'category',
        'latitude',
        'longitude',
        'name',
        'origin',
        'originalId',
        'url'
      ];

      const fieldError = helpers.requireFields(req, requiredFields);
      if (fieldError) {
        return next(fieldError);
      }

      // This is crappy and I admit it
      const event = new EventSchema({
        category: req.body.category,
        coordinates: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        endsAt: (req.body.endsAt || undefined),
        name: req.body.name,
        origin: req.body.origin,
        originalId: req.body.originalId,
        ownerId: req.user.id,
        startsAt: (req.body.startsAt || undefined),
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
