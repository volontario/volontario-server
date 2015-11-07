/**
 * All the controllers
 *
 * @param app - Express.js application
 * @param m - Mongoose connection
 */
module.exports = function (app, m) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/', function(req, res) {
    res.json({});
  });

  app.get('/locations', function(req, res) {
    m.schemas.Location.find(req.query, function(_err, locations) {
      return res.json(locations);
    });
  });

  app.get('/events', function(req, res) {
    m.schemas.Event.find(req.query, function(_err, events) {
      return res.json(events);
    });
  });

  app.post('/events', function(req, res) {
    var requiredFields = [
      'latitude',
      'longitude',
      'name',
      'originalID',
      'url'
    ];

    var missingFields = requiredFields.reduce(function(mf, rf) {
      return req.body[rf] === undefined ? mf.concat(rf) : mf;
    }, []);

    // Early exit in case of missing fields
    if (missingFields.length !== 0) {
      return res.json({'missingFields': missingFields});
    }

    var event = new m.schemas.Event({
      'latitude': req.body.latitude,
      'longitude': req.body.longitude,
      'name': req.body.name,
      'originalID': req.body.originalID,
      'url': req.body.url
    });

    event.save(function(error, event) {
      return res.json({'ok': error ? false : true}); // Umm
    });
  });
};
