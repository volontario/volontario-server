/* eslint require-jsdoc:0 */
/* eslint no-use-before-define: [2, {classes: false}] */

(function() {
  console.log('Running tests...\n');

  const _ = require('underscore');
  const async = require('async');
  const frisby = require('frisby');

  const DEFAULT_HOST = 'localhost';
  const DEFAULT_PORT = 8080;

  const EMAIL = 'testerman@test.test';
  const PASSWORD = 'testpassword';

  const CREDENTIALS = encodeURIComponent(EMAIL + ':' + PASSWORD);
  const HOST = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  const PORT = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;
  const API_ROOT = `http://${CREDENTIALS}@${HOST}:${PORT}`;

  class Event {
    constructor(overrideData) {
      const defaultData = {
        category: 'testing',
        name: 'Testing Event',
        origin: 'test_run',
        originalId: 'Original Testing Event',
        url: 'http://event-testing-url/'
      };

      this._data = _.extend(defaultData, overrideData);
    }

    get data() {
      return this._data;
    }

    set data(d) {
      this._data = d;
    }

    confirm(creationData, callback) {
      this._data.id = creationData.id;

      frisby.create('Fetch fresh event data and confirm it is the same')
        .get(`${API_ROOT}/events/${this._data.id}`)
        .expectJSON(this._data)
        .after(() => callback())
        .toss();
    }

    delete(callback) {
      frisby.create('Delete testing events')
        .delete(API_ROOT + '/events', {category: 'testing'})
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    locateTo(loc) {
      if (!(loc instanceof Location) || loc.data.id === undefined) {
        throw new Error('Location not valid');
      }

      this._data.locationId = loc.data.id;
    }

    ownBy(owner) {
      if (!(owner instanceof User) || owner.data.id === undefined) {
        throw new Error('Owner not valid');
      }

      this._data.ownerId = owner.data.id;
    }

    save(callback, expectedStatus) {
      expectedStatus = expectedStatus || 201;

      frisby.create('Create a new event')
        .post(API_ROOT + '/events', this._data)
        .expectStatus(expectedStatus)
        .afterJSON(data => callback(null, data))
        .toss();
    }
  }

  class Location {
    constructor() {
      this._data = {
        category: 'testing',
        coordinates: {
          latitude: 60.000,
          longitude: 20.000
        },
        name: 'Testing Location',
        url: 'http://location-testing-url/'
      };
    }

    get data() {
      return this._data;
    }

    set data(d) {
      this._data = d;
    }

    confirm(creationData, callback) {
      this._data.id = creationData.id;

      frisby.create('Fetch fresh location data and confirm it is the same')
        .get(`${API_ROOT}/locations/${this._data.id}`)
        .expectJSON(this._data)
        .after(() => callback())
        .toss();
    }

    delete(callback) {
      frisby.create('Delete testing locations')
        .delete(API_ROOT + '/locations', {category: 'testing'})
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    ownBy(owner) {
      if (!(owner instanceof User) || owner.data.id === undefined) {
        throw new Error('Owner not valid');
      }

      this._data.ownerId = owner.data.id;
    }

    save(callback) {
      frisby.create('Create a new location')
        .post(API_ROOT + '/locations', this._data)
        .expectStatus(201)
        .afterJSON(data => callback(null, data))
        .toss();
    }
  }

  class User {
    constructor() {
      this._data = {
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
    }

    get data() {
      return this._data;
    }

    set data(d) {
      this._data = d;
    }

    save(callback) {
      frisby.create('Create a testing user')
        .post(API_ROOT + '/users', this._data)
        .expectStatus(201)
        .afterJSON(data => callback(null, data))
        .toss();
    }

    confirm(creationData, callback) {
      this._data.id = creationData.id;

      const comparableData = _.clone(this._data);

      // Not going to be returned by the API
      comparableData.password = undefined;

      frisby.create('Fetch fresh user data and confirm it has not changed')
        .get(`${API_ROOT}/users/${this._data.id}`)
        .expectJSON(comparableData)
        .after(() => callback())
        .toss();
    }

    delete(callback) {
      frisby.create('Delete testing users')
        .delete(API_ROOT + '/users', {email: EMAIL})
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }
  }

  function testMain(callback) {
    const user = new User();

    async.waterfall([
      cb => user.save(cb),

      (data, cb) => user.confirm(data, cb),

      function(callback) {
        const location = new Location();
        location.ownBy(user);

        async.waterfall([
          cb => location.save(cb),

          (data, cb) => location.confirm(data, cb),

          function testValidEvent(callback) {
            const e = new Event();

            e.locateTo(location);
            e.ownBy(user);

            async.waterfall([
              cb => e.save(cb),
              (data, cb) => e.confirm(data, cb),
              cb => e.delete(cb),
              () => callback()
            ]);
          },

          function testEventWithoutLocation(callback) {
            const e = new Event();

            e.ownBy(user);

            async.waterfall([
              cb => e.save(cb, 422),
              () => callback()
            ]);
          },

          function testEventWithoutName(callback) {
            const e = new Event({name: undefined});

            e.locateTo(location);
            e.ownBy(user);

            async.waterfall([
              cb => e.save(cb, 422),
              () => callback()
            ]);
          },

          cb => location.delete(cb),

          () => callback()
        ]);
      },

      cb => user.delete(cb)
    ], callback);
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
