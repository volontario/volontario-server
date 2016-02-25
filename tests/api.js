/* eslint require-jsdoc:0 */
/* eslint no-use-before-define:0 */

/**
 * Test the whole API
 *
 * A gotcha: when calling .save() on deliberately bad resource, make sure
 * the following async.js callback will NOT get the data given by the save
 * by, e.g., wrapping it as "() => callback()" to deny the waterfalled data.
 * See saving of any bad resource for reference.
 */
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

  class CalendarItem {
    constructor() {
      this._data = {
        from: new Date('2016-03-10 13:00:00').toISOString(),
        to: new Date('2016-03-10 16:00:00').toISOString()
      };
    }

    get data() {
      return this._data;
    }

    set data(d) {
      this._data = d;
    }

    assignTo(user) {
      if (!(user instanceof User) || user.data.id === undefined) {
        throw new Error('User not valid');
      }

      this._data.userId = user.data.id;
    }

    confirm(creationData, callback) {
      this._data.id = creationData.id;

      const comparableData = _.clone(this._data);
      // Not going to be returned by the API
      comparableData.eventId = undefined;

      frisby.create('Fetch fresh calendar item data and compare it')
        .get(`${API_ROOT}/events/${this._data.eventId}/calendar`)
        .expectJSON([comparableData])
        .after(() => callback())
        .toss();
    }

    delete(callback) {
      const itemPath =
        `${API_ROOT}/events/${this._data.eventId}/calendar/${this._data.id}`;

      frisby.create('Delete calendar item')
        .delete(itemPath)
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    pertainTo(event) {
      if (!(event instanceof Event) || event.data.id === undefined) {
        throw new Error('Event not valid');
      }

      this._data.eventId = event.data.id;
    }

    save(callback, expectedStatus) {
      expectedStatus = expectedStatus || 201;

      frisby.create('Create a new calendar item')
        .post(`${API_ROOT}/events/${this._data.eventId}/calendar`, this._data)
        .expectStatus(expectedStatus)
        .afterJSON(data => callback(null, data))
        .toss();
    }
  }

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

      frisby.create('Fetch fresh event data and compare it')
        .get(`${API_ROOT}/events/${this._data.id}`)
        .expectJSON(this._data)
        .after(() => callback())
        .toss();
    }

    confirmFields(callback) {
      const confirmName = cb => {
        frisby.create('Fetch event name and compare it')
          .get(`${API_ROOT}/events/${this._data.id}/name`)
          .expectJSON({name: this._data.name})
          .after(() => cb())
          .toss();
      };

      const confirmLocationId = cb => {
        frisby.create('Fetch event locationId and compare them')
          .get(`${API_ROOT}/events/${this._data.id}/locationId`)
          .expectJSON({locationId: this._data.locationId})
          .after(() => cb())
          .toss();
      };

      async.series([confirmName, confirmLocationId], () => callback());
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

      frisby.create('Fetch fresh location data and compare it')
        .get(`${API_ROOT}/locations/${this._data.id}`)
        .expectJSON(this._data)
        .after(() => callback())
        .toss();
    }

    confirmFields(callback) {
      const confirmName = cb => {
        frisby.create('Fetch location name and compare it')
          .get(`${API_ROOT}/locations/${this._data.id}/name`)
          .expectJSON({name: this._data.name})
          .after(() => cb())
          .toss();
      };

      const confirmCoordinates = cb => {
        frisby.create('Fetch location coordinates and compare them')
          .get(`${API_ROOT}/locations/${this._data.id}/coordinates`)
          .expectJSON({coordinates: this._data.coordinates})
          .after(() => cb())
          .toss();
      };

      async.series([confirmName, confirmCoordinates], () => callback());
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

    confirmFields(callback) {
      const confirmEmail = cb => {
        frisby.create('Fetch user email and compare it')
          .get(`${API_ROOT}/users/${this._data.id}/email`)
          .expectJSON({email: this._data.email})
          .after(() => cb())
          .toss();
      };

      const confirmCoordinates = cb => {
        frisby.create('Fetch user coordinates and compare them')
          .get(`${API_ROOT}/users/${this._data.id}/coordinates`)
          .expectJSON({coordinates: this._data.coordinates})
          .after(() => cb())
          .toss();
      };

      async.series([confirmEmail, confirmCoordinates], () => callback());
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
      cb => user.confirmFields(cb),

      function testValidLocation(callback) {
        const location = new Location();
        location.ownBy(user);

        async.waterfall([
          cb => location.save(cb),

          (data, cb) => location.confirm(data, cb),
          cb => location.confirmFields(cb),

          function testValidEvent(callback) {
            const e = new Event();

            e.locateTo(location);
            e.ownBy(user);

            async.waterfall([
              cb => e.save(cb),
              (data, cb) => e.confirm(data, cb),
              cb => e.confirmFields(cb),

              function testValidCalendarItem(callback) {
                const i = new CalendarItem();

                i.assignTo(user);
                i.pertainTo(e);

                async.waterfall([
                  cb => i.save(cb),
                  (data, cb) => i.confirm(data, cb),
                  cb => i.delete(cb)
                ], callback);
              },

              cb => e.delete(cb)
            ], callback);
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

          cb => location.delete(cb)
        ], callback);
      },

      function testBadLocation(callback) {
        const location = new Location();

        async.waterfall([
          cb => location.save(cb, 422),
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
      .after(callback)
      .toss();
  }

  function deleteTestUserAnyway(callback) {
    frisby.create('Delete old testing users')
      .delete(API_ROOT + '/users', {email: EMAIL})
      .after(callback)
      .toss();
  }

  module.exports = function() {
    async.series([
      deleteTestUserAnyway,
      testPing,
      testMain
    ]);
  };
})();
