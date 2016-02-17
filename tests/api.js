module.exports = function() {
  const DEFAULT_HOST = 'localhost';
  const DEFAULT_PORT = 8080;

  const TESTING_EMAIL = 'testerman@test.test';
  const TESTING_PASSWORD = 'testpassword';

  const frisby = require('frisby');

  let credentials = encodeURIComponent(TESTING_EMAIL + ':' + TESTING_PASSWORD);
  let host = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  let port = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;
  const API_ROOT = `http://${credentials}@${host}:${port}`;

  const userData = {
    coordinates: {
      latitude: 58.000,
      longitude: 18.000
    },
    dateOfBirth: '1990-12-01',
    email: TESTING_EMAIL,
    familyName: 'User',
    givenName: 'Testing',
    password: TESTING_PASSWORD,
    phoneNumber: '+35850000000',
    tags: ['tagA', 'tagB', 'tagC']
  };

  frisby.create('Make sure the API returns something')
    .get(API_ROOT)
    .expectStatus(200)
    .expectBodyContains('{}')
    .toss();

  frisby.create('Create a testing user')
    .post(API_ROOT + '/users', userData)
    .expectStatus(201)
    .after(function(_err, _res, data) {
      const userId = JSON.parse(data).id;

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
        .after(function(_err, _res, data) {
          const locationId = JSON.parse(data).id;

          frisby.create('Fetch fresh location data and confirm it is the same')
            .get(`${API_ROOT}/locations/${locationId}`)
            .expectJSON(locationData)
            .toss();
        })
        .toss();

      frisby.create('Delete testing locations')
        .delete(API_ROOT + '/locations', {category: 'testing'})
        .expectStatus(205)
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
        .after(function(_err, _res, data) {
          const eventId = JSON.parse(data).id;

          frisby.create('Fetch fresh event data and confirm it is the same')
            .get(`${API_ROOT}/events/${eventId}`)
            .expectJSON(eventData)
            .toss();
        })
        .toss();

      frisby.create('Delete testing users')
        .delete(API_ROOT + '/users', {email: TESTING_EMAIL})
        .expectStatus(205)
        .toss();
    })
    .toss();
};
