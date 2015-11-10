module.exports = function(schemas) {
  var request = require('request');

  var URL = 'https://www.toimintasuomi.fi/api/v1/vapaaehtoistoiminta.json';

  request(URL, function(error, response, body) {
    var events = JSON.parse(body);

    var eventsWithCoordinates = events.filter(function(e) {
      return e.coordinates && e.coordinates.length === 2;
    });

    eventsWithCoordinates.forEach(function(e) {
      var event = new schemas.Event({
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

      delete event._id;
      schemas.Event.findOneAndUpdate(
        {originalId: event.originalId},
        event,
        {upsert: true},
        function(error) {
          if (error) {
            console.log(error);
          }
        }
      );
    });
  });
};
