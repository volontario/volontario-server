 module.exports = function(frisby, _, API_ROOT, Event, User) {
  const exportedClass = class {
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
        .afterJSON(comparableData => callback(null, comparableData))
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
  };

  return exportedClass;
};
