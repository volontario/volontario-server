module.exports = function(EventSchema) {
  const URL = 'https://www.toimintasuomi.fi/api/v1/vapaaehtoistoiminta.json';

  const request = require('request');

  request(URL, function(error, response, body) {
    const events = JSON.parse(body);

    const hasCoordinates = e => e.coordinates && e.coordinates.length === 2;
    const eventsWithCoordinates = events.filter(hasCoordinates);

    eventsWithCoordinates.forEach(function(e) {
      const event = {
        category: 'voluntaryWork',
        coordinates: {
          longitude: e.coordinates[0],
          latitude: e.coordinates[1]
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
