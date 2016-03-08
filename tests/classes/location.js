module.exports = function(frisby, _, async, API_ROOT, User) {
  const exportedClass = class {
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

    confirmUniqueName(cb) {
      const comparableData = _.clone(this._data);

      frisby.create('Fetch from all locations but expect only this')
        .get(`${API_ROOT}/locations?filters.name=${this._data.name}`)
        .expectJSON([comparableData])
        .after(() => cb())
        .toss();
    }

    delete(callback) {
      frisby.create('Delete location')
        .delete(`${API_ROOT}/locations/${this._data.id}`)
        .expectStatus(205)
        .after(() => callback())
        .toss();
    }

    deleteByName(callback) {
      const data = {name: this._data.name};

      frisby.create('Delete locations by name')
        .delete(`${API_ROOT}/locations`, data)
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
  };

  return exportedClass;
};
