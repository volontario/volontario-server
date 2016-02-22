module.exports = function(EventSchema) {
  const URL = 'https://www.toimintasuomi.fi/api/v1/vapaaehtoistoiminta.json';

  const request = require('request');

  request(URL, function(error, response, body) {
    const events = JSON.parse(body);

    const hasCoordinates = e => e.coordinates && e.coordinates.length === 2;
    const locatedEvents = events.filter(hasCoordinates);

    /**
     * The provided events may have a version suffix. Separate the suffix
     * and pick the latest event by comparing suffices. If there is no suffix,
     * pick the first event.
     */
    const latestLocatedEvents = locatedEvents.reduce(function(latests, cur) {
      const versionRegex = /-\d+$/;
      const versionSuffixData = versionRegex.exec(cur.id);

      let bareId;
      if (versionSuffixData) {
        const version = versionSuffixData[0].substr(1);
        cur.id = bareId = cur.id.replace(versionRegex, '');
        cur.version = parseInt(version, 10);
      } else {
        bareId = cur.id;
        cur.version = 0;
      }

      if (!latests[bareId] || latests[bareId].version < cur.version) {
        latests[bareId] = cur;
      }

      return latests;
    }, {});

    Object.keys(latestLocatedEvents).forEach(function(eKey) {
      const e = latestLocatedEvents[eKey];
      const model = {
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
        {originalId: model.originalId},
        model,
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
