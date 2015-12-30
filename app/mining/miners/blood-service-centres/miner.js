module.exports = function(LocationSchema) {
  let sourceLocations = [
    {
      category: 'bloodServiceCentre',
      title: 'Jyväskylän veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Jyvaskyla',
      updatedAt: '2015-12-30T17:23:26.050Z',
      ownerId: null,
      coordinates: {
        latitude: 62.2451577,
        longitude: 25.7527736
      },
      addedAt: '2015-12-30T17:23:26.048Z',
      id: '563a46ab5695ccbccd0fbe18'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Helsinki, Kivihaan veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Kivihaka',
      updatedAt: '2015-12-30T17:23:26.054Z',
      ownerId: null,
      coordinates: {
        latitude: 60.21226727740157,
        longitude: 24.90440602226265
      },
      addedAt: '2015-12-30T17:23:26.054Z',
      id: '563a46ab5695ccbccd0fbe19'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Kuopion veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Kuopio',
      updatedAt: '2015-12-30T17:23:26.055Z',
      ownerId: null,
      coordinates: {
        latitude: 62.89249,
        longitude: 27.679796
      },
      addedAt: '2015-12-30T17:23:26.055Z',
      id: '563a46ab5695ccbccd0fbe1a'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Oulun veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Oulu',
      updatedAt: '2015-12-30T17:23:26.056Z',
      ownerId: null,
      coordinates: {
        latitude: 65.0103311,
        longitude: 25.4706285
      },
      addedAt: '2015-12-30T17:23:26.056Z',
      id: '563a46ab5695ccbccd0fbe1b'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Seinäjoen veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Seinajoki',
      updatedAt: '2015-12-30T17:23:26.057Z',
      ownerId: null,
      coordinates: {
        latitude: 62.788247,
        longitude: 22.834242
      },
      addedAt: '2015-12-30T17:23:26.057Z',
      id: '563a46ab5695ccbccd0fbe1c'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Tampereen veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Tampere',
      updatedAt: '2015-12-30T17:23:26.058Z',
      ownerId: null,
      coordinates: {
        latitude: 61.499769,
        longitude: 23.771625
      },
      addedAt: '2015-12-30T17:23:26.058Z',
      id: '563a46ab5695ccbccd0fbe1d'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Turun veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Turku',
      updatedAt: '2015-12-30T17:23:26.058Z',
      ownerId: null,
      coordinates: {
        latitude: 60.4526825,
        longitude: 22.2677662
      },
      addedAt: '2015-12-30T17:23:26.058Z',
      id: '563a46ab5695ccbccd0fbe1e'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Helsinki, Sanomatalon veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/sanomatalo',
      updatedAt: '2015-12-30T17:23:26.059Z',
      ownerId: null,
      coordinates: {
        latitude: 60.172343,
        longitude: 24.938643
      },
      addedAt: '2015-12-30T17:23:26.059Z',
      id: '563a46ab5695ccbccd0fbe1f'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Lahden veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Lahti',
      updatedAt: '2015-12-30T17:23:26.061Z',
      ownerId: null,
      coordinates: {
        latitude: 60.98388860443699,
        longitude: 25.66408791583974
      },
      addedAt: '2015-12-30T17:23:26.060Z',
      id: '563a46ab5695ccbccd0fbe20'
    },
    {
      category: 'bloodServiceCentre',
      title: 'Espoon veripalvelutoimisto',
      url: 'http://www.veripalvelu.fi/www/Espoo',
      updatedAt: '2015-12-30T17:23:26.063Z',
      ownerId: null,
      coordinates: {
        latitude: 60.161102,
        longitude: 24.740111
      },
      addedAt: '2015-12-30T17:23:26.062Z',
      id: '563a46ab5695ccbccd0fbe21'
    }
  ];

  sourceLocations.forEach(function(loc) {
    LocationSchema.findOneAndUpdate(
      {originalId: loc.id},
      loc,
      {upsert: true},
      function(error) {
        if (error) {
          console.log(error);
        }
      }
    );
  });
};
