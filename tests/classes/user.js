module.exports = function(frisby, _, async, API_ROOT, EMAIL, PASSWORD) {
  const exportedClass = class {
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

      this.events = [];
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

    confirmEvents(assumedEvents, callback) {
      frisby.create('Fetch user events and compare them')
        .get(`${API_ROOT}/users/${this._data.id}/events`)
        .expectJSON(this.events.map(e => e.data))
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

    confirmUniqueFamilyName(cb) {
      const comparableData = _.clone(this._data);
      // Not going to be returned by the API
      comparableData.password = undefined;

      frisby.create('Fetch from all users but expect only this')
        .get(`${API_ROOT}/users?filters.familyName=${this._data.familyName}`)
        .expectJSON([comparableData])
        .after(() => cb())
        .toss();
    }

    delete(callback) {
      frisby.create('Delete user')
        .delete(`${API_ROOT}/users/${this._data.id}`)
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    deleteByFamilyName(callback) {
      const data = {familyName: this._data.familyName};

      frisby.create('Delete users by family name')
        .delete(`${API_ROOT}/users`, data)
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    ownEvent(newEvent) {
      if (this.events.some(e => e.id === newEvent.id)) {
        return;
      }

      this.events.push(newEvent);
    }
  };

  return exportedClass;
};
