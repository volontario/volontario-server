/* eslint require-jsdoc:0 */

(function() {
  const async = require('async');
  const frisby = require('frisby');

  const DEFAULT_HOST = 'localhost';
  const DEFAULT_PORT = 8080;

  const EMAIL = 'testerman@test.test';
  const PASSWORD = 'testpassword';

  const credentials = encodeURIComponent(EMAIL + ':' + PASSWORD);
  const host = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  const port = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;
  const API_ROOT = `http://${credentials}@${host}:${port}`;

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

  const locationData = {
    category: 'testing',
    coordinates: {
      latitude: 60.000,
      longitude: 20.000
    },
    name: 'Testing Location',
    url: 'http://location-testing-url/'
  };

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

  function confirmFreshEvent(creationData, callback) {
    const eventId = creationData.id;

    frisby.create('Fetch fresh event data and confirm it is the same')
      .get(`${API_ROOT}/events/${eventId}`)
      .expectJSON(eventData)
      .after(() => callback())
      .toss();
  }

  function confirmFreshLocation(creationData, callback) {
    const locationId = creationData.id;

    frisby.create('Fetch fresh location data and confirm it is the same')
      .get(`${API_ROOT}/locations/${locationId}`)
      .expectJSON(locationData)
      .after(() => callback())
      .toss();
  }

  function confirmFreshUser(creationData, callback) {
    const userId = creationData.id;
    userData.password = undefined;
    frisby.create('Fetch fresh user data and confirm it has not changed')
      .get(`${API_ROOT}/users/${userId}`)
      .expectJSON(userData)
      .after(() => callback())
      .toss();
  }

  function createEvent(callback) {
    frisby.create('Create a new event')
      .post(API_ROOT + '/events', eventData)
      .expectStatus(201)
      .afterJSON(data => callback(null, data))
      .toss();
  }

  function createLocation(callback) {
    frisby.create('Create a new location')
      .post(API_ROOT + '/locations', locationData)
      .expectStatus(201)
      .afterJSON(data => callback(null, data))
      .toss();
  }

  function createUser(callback) {
    frisby.create('Create a testing user')
      .post(API_ROOT + '/users', userData)
      .expectStatus(201)
      .afterJSON(data => callback(null, data))
      .toss();
  }

  function deleteTestingEvents(callback) {
    frisby.create('Delete testing events')
      .delete(API_ROOT + '/events', {category: 'testing'})
      .expectStatus(205)
      .after(() => callback())
      .toss();
  }

  function deleteTestingLocations(callback) {
    frisby.create('Delete testing locations')
      .delete(API_ROOT + '/locations', {category: 'testing'})
      .expectStatus(205)
      .after(() => callback())
      .toss();
  }

  function deleteTestingUsers(callback) {
    frisby.create('Delete testing users')
      .delete(API_ROOT + '/users', {email: EMAIL})
      .expectStatus(205)
      .after(() => callback())
      .toss();
  }

  function testMain(callback) {
    async.waterfall([
      createUser,
      confirmFreshUser,

      createLocation,
      confirmFreshLocation,
      deleteTestingLocations,

      createEvent,
      confirmFreshEvent,
      deleteTestingEvents,

      deleteTestingUsers
    ]);

    callback();
  }

  function testPing(callback) {
    frisby.create('Make sure the API returns something')
      .get(API_ROOT)
      .expectStatus(200)
      .expectJSON({})
      .after(() => callback())
      .toss();
  }

  module.exports = function() {
    async.series([
      testPing,
      testMain
    ]);
  };
})();
