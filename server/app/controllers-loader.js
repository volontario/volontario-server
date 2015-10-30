/**
 * All the controllers
 *
 * @param app - Express.js application
 * @param m - Mongoose connection
 */
module.exports = function (app, m) {
  app.get('/', function(req, res) {
    res.json({});
  });

  app.get('/locations', function(req, res) {
    m.schemas.Location.find(req.query, function(_err, locations) {
      return res.json(locations);
    });
  });
};
