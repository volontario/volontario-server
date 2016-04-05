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

  const HOST = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  const PORT = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;

  const DEFAULT_USER = {
    email: EMAIL,
    password: PASSWORD
  };

  const apiRooter = function(user) {
    let auth;
    if (user) {
      auth = encodeURIComponent(user.email) + ':' +
        encodeURIComponent(user.password);
    } else {
      auth = '';
    }

    return `http://${auth}@${HOST}:${PORT}`;
  };

  const User =
    require('./classes/user.js')(frisby, _, async, apiRooter, EMAIL, PASSWORD);
  const Location =
    require('./classes/location.js')(frisby, _, async, apiRooter, User);
  const Event =
    require('./classes/event.js')(frisby, _, async, apiRooter, Location, User);
  const CalendarItem =
    require('./classes/calendar-item.js')(frisby, _, apiRooter, Event, User);

  function testMain(callback) {
    const user = new User();

    async.waterfall([
      cb => user.save(cb),

      (data, cb) => user.confirm(data, cb),
      cb => user.confirmFields(cb),

      function testHandlingMultipleUsers(callback) {
        const differentUser = new User();
        differentUser.data.email = 'supertest@test.test';
        differentUser.data.familyName = 'Testerberg';

        async.waterfall([
          cb => differentUser.save(cb),
          (data, cb) => differentUser.confirm(data, cb),
          cb => differentUser.confirmUniqueFamilyName(cb),
          cb => differentUser.deleteByFamilyName(cb)
        ], callback);
      },

      function testValidLocation(callback) {
        const location = new Location();
        location.ownBy(user);

        async.waterfall([
          cb => location.save(cb),

          (data, cb) => location.confirm(data, cb),
          cb => location.confirmFields(cb),

          function testHandlingMultipleLocations(callback) {
            const differentLocation = new Location();
            differentLocation.data.name = 'SuperLocation 2000';
            differentLocation.data.coordinates.latitude = 40.123;
            differentLocation.ownBy(user);

            async.waterfall([
              cb => differentLocation.save(cb),
              (data, cb) => differentLocation.confirm(data, cb),
              cb => differentLocation.confirmUniqueName(cb),
              cb => differentLocation.deleteByName(cb)
            ], callback);
          },

          function testValidEvent(callback) {
            const e = new Event();

            e.locateTo(location);
            e.ownBy(user);

            async.waterfall([
              cb => e.save(cb),
              (data, cb) => e.confirm(data, cb),
              cb => e.confirmFields(cb),

              function testHandlingMultipleEvents(callback) {
                const differentEvent = new Event();
                differentEvent.data.name = 'SuperEvent 2000';
                differentEvent.data.url = 'http://super-event-2000.org';

                differentEvent.locateTo(location);
                differentEvent.ownBy(user);

                async.waterfall([
                  cb => differentEvent.save(cb),
                  (data, cb) => differentEvent.confirm(data, cb),
                  cb => differentEvent.confirmUniqueUrl(cb),
                  cb => differentEvent.deleteByUrl(cb)
                ], callback);
              },

              function testValidCalendarItem(callback) {
                const i = new CalendarItem();

                i.assignTo(user);
                i.pertainTo(e);

                async.waterfall([
                  cb => i.save(cb),
                  (data, cb) => i.confirm(data, cb),
                  (data, cb) => user.confirmEvents(data, cb),
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

      function testUserAuthorization(callback) {
        const differentUser = new User();
        differentUser.data.email = 'anotheruser@test.test';

        async.waterfall([
          cb => differentUser.save(cb),
          (data, cb) => differentUser.confirm(data, cb),

          function createLocation(callback) {
            const differentLocation = new Location();
            differentLocation.ownBy(user);

            async.waterfall([
              cb => differentLocation.save(cb),
              (data, cb) => differentLocation.confirm(data, cb),

              function(callback) {
                differentLocation.ownBy(differentUser);
                differentLocation.deleteAndFailAuthorization(callback);
              },

              function(callback) {
                differentLocation.ownBy(user);
                callback();
              },

              cb => differentLocation.delete(cb)
            ], callback);
          },

          cb => differentUser.delete(cb)
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
      .get(apiRooter(DEFAULT_USER))
      .expectStatus(200)
      .expectJSON({})
      .after(callback)
      .toss();
  }

  function deleteTestUserAnyway(callback) {
    frisby.create('Delete old testing users')
      .delete(apiRooter(DEFAULT_USER) + '/users', {email: EMAIL})
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
