module.exports = {
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

  decorateError: function(error) {
    switch (error.name) {
      case 'ValidationError':
        let requiredKeys = [];
        for (let key in error.errors) {
          if (error.errors[key].kind !== 'required') {
            return new Error('Database error');
          }

          requiredKeys.push(key);
        }

        let joinedKeys = requiredKeys.join(', ');
        return new Error(`Missing fields: ${joinedKeys}`);

      case 'MongoError':
        if (error.code !== 11000) {
          break;
        }

        return new Error('Resource not unique');

      default:
        return new Error('Database error');
    }
  },

  dropExcludedProperties: function(propertyList, originalObject) {
    return propertyList.reduce(function(incompleteObject, property) {
      incompleteObject[property] = originalObject[property];
      return incompleteObject;
    }, {});
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
