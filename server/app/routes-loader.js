function runMiner(mongooseConnection, name) {
  require('./miner-master.js')(mongooseConnection, name);
}

/**
 * All the routes
 *
 * @param app - Express.js application
 * @param m - Mongoose connection
 */
module.exports = function (m, app) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/', function(req, res) {
    res.json({});
  });

  app.get('/locations', function(req, res) {
    m.schemas.Location.find(req.query, function(_err, locations) {
      var strippedLocations = locations.map(function(loc) {
        loc._id = undefined;
        return loc;
      });

      return res.json(strippedLocations);
    });
  });

  app.get('/events', function(req, res) {
    runMiner(m, 'toimintasuomi');
    m.schemas.Event.find(req.query, function(_err, events) {
      return res.json(events);
    });
  });

  app.post('/events', function(req, res) {
    var requiredFields = [
      'latitude',
      'longitude',
      'name',
      'originalId',
      'url'
    ];

    var missingFields = requiredFields.reduce(function(mf, rf) {
      return req.body[rf] === undefined ? mf.concat(rf) : mf;
    }, []);

    // Early exit in case of missing fields
    if (missingFields.length !== 0) {
      return res.json({'missingFields': missingFields});
    }

    // This is crappy and I admit it
    var event = new m.schemas.Event({
      'latitude': req.body.latitude,
      'longitude': req.body.longitude,
      'name': req.body.name,
      'originalId': req.body.originalId,
      'url': req.body.url
    });

    event.save(function(error, event) {
      return res.json({'ok': error ? false : true}); // Umm
    });
  });

  app.get('/users', function(req, res) {
    m.schemas.User.find(req.query, function(_err, users) {
      return res.json(users);
    });
  });

  app.post('/users', function(req, res) {
    var requiredFields = [
      'dateOfBirth',
      'familyName',
      'givenName',
      'latitude',
      'longitude',
      'email',
      'phoneNumber',
      'tags'
    ];

    var missingFields = requiredFields.reduce(function(mf, rf) {
      return req.body[rf] === undefined ? mf.concat(rf) : mf;
    }, []);

    // Early exit in case of missing fields
    if (missingFields.length !== 0) {
      return res.json({'missingFields': missingFields});
    }

    // This is crappy and I admit it
    var user = new m.schemas.User({
      'dateOfBirth': new Date(req.body.dateOfBirth),
      'familyName': req.body.familyName,
      'givenName': req.body.givenName,
      'latitude': req.body.latitude,
      'longitude': req.body.longitude,
      'email': req.body.email,
      'phoneNumber': req.body.phoneNumber,
      'tags': req.body.tags.split(',')
    });

    user.save(function(error, _user) {
      if (error) {
        return res.json({
          'ok': false,
          'error': error
        });
      } else {
        return res.json({'ok': true});
      }
    });
  });

};
