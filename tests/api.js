module.exports = function() {
  const DEFAULT_HOST = 'localhost';
  const DEFAULT_PORT = 8080;

  const TESTING_EMAIL = 'testerman@test.test';
  const TESTING_PASSWORD = 'testpassword';

  let frisby = require('frisby');

  let credentials = encodeURIComponent(TESTING_EMAIL + ':' + TESTING_PASSWORD);
  let host = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  let port = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;
  let url = 'http://' + credentials + '@' + host + ':' + port;

  frisby.create('Make sure the API returns something')
    .get(url)
    .expectStatus(200)
    .expectBodyContains('{}')
    .toss();

  frisby.create('Create a testing user')
    .post(url + '/users', {
      dateOfBirth: '1990-12-01',
      email: TESTING_EMAIL,
      familyName: 'User',
      givenName: 'Testing',
      latitude: 58.000,
      longitude: 18.000,
      password: TESTING_PASSWORD,
      phoneNumber: '+35850000000',
      tags: 'tagA,tagB,tagC'
    })
    .expectStatus(201)
    .after(function() {
      frisby.create('Create a new location')
        .post(url + '/locations', {
          category: 'testing',
          latitude: 60.000,
          longitude: 20.000,
          name: 'Testing Location',
          url: 'http://location-testing-url/'
        })
        .expectStatus(201)
        .toss();

      frisby.create('Delete testing locations')
        .delete(url + '/locations', {category: 'testing'})
        .expectStatus(205)
        .toss();

      frisby.create('Create a new event')
        .post(url + '/events', {
          category: 'testing',
          latitude: 62.000,
          longitude: 22.000,
          name: 'Testing Event',
          origin: 'test_run',
          originalId: 'Original Testing Event',
          url: 'http://event-testing-url/'
        })
        .expectStatus(201)
        .toss();

      frisby.create('Delete testing events')
        .delete(url + '/events', {category: 'testing'})
        .expectStatus(205)
        .toss();

      frisby.create('Delete testing users')
        .delete(url + '/users', {email: TESTING_EMAIL})
        .expectStatus(205)
        .toss();
    })
    .toss();
};
