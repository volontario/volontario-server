module.exports = function(mongooseConnection) {
  var request = require('request');

  var URL = 'https://www.toimintasuomi.fi/api/v1/vapaaehtoistoiminta.json';

  request(URL, function(error, response, body) {
    var events = JSON.parse(body);

    var eventsWithCoordinates = events.filter(function(e) {
      return e.coordinates && e.coordinates.length === 2;
    });

    eventsWithCoordinates.forEach(function(e) {
      var existingEvent = mongooseConnection.schemas.Event.find({originalId: e.id}).limit(1);
      if (existingEvent) {
        return;
      }

      var newEvent = new mongooseConnection.schemas.Event({
        category: 'voluntaryWork',
        coordinates: {
          latitude: e.coordinates[0],
          longitude: e.coordinates[1]
        },
        name: e.title,
        originalId: e.id,
        origin: 'toimintasuomi',
        url: e.uri
      });

      newEvent.save(function(error, _data) {
        if (error) {
          console.log(error);
        }
      });
    });
  });
};
