module.exports = {
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
    let missingFields = requiredFields.reduce(function(mf, rf) {
      return req.body[rf] === undefined ? mf.concat(rf) : mf;
    }, []);

    let missingFormattedFields = missingFields.join(', ');

    // Early exit in case of missing fields
    if (missingFields.length !== 0) {
      return new Error(`Missing fields: ${missingFormattedFields}`);
    }
  }
};
