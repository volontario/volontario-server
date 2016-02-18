module.exports = function() {
  const DEFAULT_HOST = 'localhost';
  const DEFAULT_PORT = 8080;

  const EMAIL = 'testerman@test.test';
  const PASSWORD = 'testpassword';

  const frisby = require('frisby');

  const credentials = encodeURIComponent(EMAIL + ':' + PASSWORD);
  const host = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  const port = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;
  const API_ROOT = `http://${credentials}@${host}:${port}`;

  frisby.create('Make sure the API returns something')
    .get(API_ROOT)
    .expectStatus(200)
    .expectBodyContains('{}')
    .toss();

  const userData = {
    coordinates: {
      latitude: 58.000,
      longitude: 18.000
    },
    dateOfBirth: '1990-12-01',
    email: EMAIL,
    familyName: 'User',
    givenName: 'Testing',
    password: PASSWORD,
    phoneNumber: '+35850000000',
    tags: ['tagA', 'tagB', 'tagC']
  };
  frisby.create('Create a testing user')
    .post(API_ROOT + '/users', userData)
    .expectStatus(201)
    .afterJSON(function(data) {
      const userId = data.id;

      userData.password = undefined;
      frisby.create('Fetch fresh user data and confirm it has not changed')
        .get(`${API_ROOT}/users/${userId}`)
        .expectJSON(userData)
        .toss();

      const locationData = {
        category: 'testing',
        coordinates: {
          latitude: 60.000,
          longitude: 20.000
        },
        name: 'Testing Location',
        url: 'http://location-testing-url/'
      };
      frisby.create('Create a new location')
        .post(API_ROOT + '/locations', locationData)
        .expectStatus(201)
        .afterJSON(function(data) {
          const locationId = data.id;

          frisby.create('Fetch fresh location data and confirm it is the same')
            .get(`${API_ROOT}/locations/${locationId}`)
            .expectJSON(locationData)
            .after(function() {
              frisby.create('Delete testing locations')
                .delete(API_ROOT + '/locations', {category: 'testing'})
                .expectStatus(205)
                .toss();
            })
            .toss();
        })
        .toss();

      const eventData = {
        category: 'testing',
        coordinates: {
          latitude: 62.000,
          longitude: 22.000
        },
        name: 'Testing Event',
        origin: 'test_run',
        originalId: 'Original Testing Event',
        url: 'http://event-testing-url/'
      };
      frisby.create('Create a new event')
        .post(API_ROOT + '/events', eventData)
        .expectStatus(201)
        .afterJSON(function(data) {
          const eventId = data.id;

          frisby.create('Fetch fresh event data and confirm it is the same')
            .get(`${API_ROOT}/events/${eventId}`)
            .expectJSON(eventData)
            .after(function() {
              frisby.create('Delete testing events')
                .delete(API_ROOT + '/events', {category: 'testing'})
                .expectStatus(205)
                .toss();
            })
            .toss();
        })
        .toss();
    })
    .after(function() {
      setTimeout(function() {
        frisby.create('Delete testing users')
          .delete(API_ROOT + '/users', {email: EMAIL})
          .expectStatus(205)
          .toss();
      }, 500);
    })
    .toss();
};
