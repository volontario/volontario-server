const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');

module.exports = function(schemas) {
  return {
    // http://stackoverflow.com/questions/27928/calculate-distance-between-\
    // two-latitude-longitude-points-haversine-formula
    calculateDistanceBetween: function(latA, lonA, latB, lonB) {
      // Radius of the Earth
      const r = 6371000;

      const degToRad = deg => deg * (Math.PI / 180);

      const dLat = degToRad(latB - latA);
      const dLon = degToRad(lonB - lonA);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(latA)) * Math.cos(degToRad(latB)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = r * c;
      return d;
    },

    decorateError: function(err) {
      switch (err.name) {
        case 'ValidationError':
          let requiredKeys = [];
          for (let key in err.errors) {
            if (err.errors[key].kind !== 'required') {
              return new Error('Database error');
            }

            requiredKeys.push(key);
          }

          let joinedKeys = requiredKeys.join(', ');
          return new Error(`Missing fields: ${joinedKeys}`);

        case 'MongoError':
          if (err.code !== 11000) {
            break;
          }

          return new Error('Resource not unique');

        default:
          return new Error('Database error');
      }
    },

    digest: function(password, salt) {
      if (typeof password !== String || typeof salt !== String) {
        return null;
      }

      return pbkdf2
        .pbkdf2Sync(password, salt, 16384, 128, 'sha512')
        .toString('hex');
    },

    dropExcludedProperties: function(propertyList, originalObject) {
      return propertyList.reduce(function(incompleteObject, property) {
        incompleteObject[property] = originalObject[property];
        return incompleteObject;
      }, {});
    },

    generateSalt: function() {
      return crypto.randomBytes(128).toString('hex');
    },

    isOwnerOrTheirAncestor: function(testedUser, doc) {
      if (doc.ownerId === testedUser.id) {
        return true;
      }

      const recurseToAncestors = function(doc) {
        if (!doc.ownerId) {
          return false;
        }

        schemas.User.findById(doc.ownerId, function(err, owner) {
          if (err || !owner) {
            return false;
          }

          if (owner.ownerId === testedUser.id) {
            return true;
          }

          recurseToAncestors(owner);
        });
      };

      return recurseToAncestors(doc);
    },

    requireNotVagueFlag: function(req) {
      if (req.body.notVague === 'true') {
        // Now the flag won't be left hanging around
        req.body = {};
      } else if (Object.getOwnPropertyNames(req.body).length === 0) {
        return new Error('Possibly too vague: use notVague=true to enforce');
      }

      return null;
    },

    requireFields: function(req, requiredFields) {
      const missingFields = requiredFields.reduce(function(mf, rf) {
        const missing = req.body[rf] === undefined &&
          req.query[rf] === undefined;

        return missing ? mf.concat(rf) : mf;
      }, []);

      const missingFormattedFields = missingFields.join(', ');

      // Early exit in case of missing fields
      if (missingFields.length !== 0) {
        return new Error(`Missing fields: ${missingFormattedFields}`);
      }
    }
  };
};
