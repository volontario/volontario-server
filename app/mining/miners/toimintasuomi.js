module.exports = function(EventSchema) {
  const URL = 'https://www.toimintasuomi.fi/api/v1/vapaaehtoistoiminta.json';

  let request = require('request');

  request(URL, function(error, response, body) {
    let events = JSON.parse(body);

    let hasCoordinates = e => e.coordinates && e.coordinates.length === 2;
    let eventsWithCoordinates = events.filter(hasCoordinates);

    eventsWithCoordinates.forEach(function(e) {
      let event = {
        category: 'voluntaryWork',
        coordinates: {
          latitude: e.coordinates[0],
          longitude: e.coordinates[1]
        },
        name: e.title,
        originalId: e.id,
        origin: 'toimintasuomi',
        url: e.uri
      };

      EventSchema.findOneAndUpdate(
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
