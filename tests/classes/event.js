module.exports = function(frisby, _, async, apiRooter, Location, User) {
  const exportedClass = class {
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
        .get(`${apiRooter(this._auth)}/events/${this._data.id}`)
        .expectJSON(this._data)
        .after(() => callback())
        .toss();
    }

    confirmFields(callback) {
      const confirmName = cb => {
        frisby.create('Fetch event name and compare it')
          .get(`${apiRooter(this._auth)}/events/${this._data.id}/name`)
          .expectJSON({name: this._data.name})
          .after(() => cb())
          .toss();
      };

      const confirmLocationId = cb => {
        frisby.create('Fetch event locationId and compare them')
          .get(`${apiRooter(this._auth)}/events/${this._data.id}/locationId`)
          .expectJSON({locationId: this._data.locationId})
          .after(() => cb())
          .toss();
      };

      async.series([confirmName, confirmLocationId], () => callback());
    }

    confirmUniqueUrl(cb) {
      const comparableData = _.clone(this._data);

      frisby.create('Fetch from all events but expect only this')
        .get(`${apiRooter(this._auth)}/events?filters.url=${this._data.url}`)
        .expectJSON([comparableData])
        .after(() => cb())
        .toss();
    }

    delete(callback) {
      frisby.create('Delete event')
        .delete(`${apiRooter(this._auth)}/events/${this._data.id}`)
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    deleteByUrl(callback) {
      const data = {url: this._data.url};

      frisby.create('Delete events by URL')
        .delete(`${apiRooter(this._auth)}/events`, data)
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

      owner.ownEvent(this);
      this._data.ownerId = owner.data.id;
      this._auth = owner.data;
    }

    save(callback, expectedStatus) {
      expectedStatus = expectedStatus || 201;

      frisby.create('Create a new event')
        .post(apiRooter(this._auth) + '/events', this._data)
        .expectStatus(expectedStatus)
        .afterJSON(data => callback(null, data))
        .toss();
    }
  };

  return exportedClass;
};
