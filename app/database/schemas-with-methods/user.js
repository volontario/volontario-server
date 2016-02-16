module.exports = {
  schema: {
    addedAt: {type: Date, default: Date.now},
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    dateOfBirth: {type: Date, get: function(rawDate) {
      console.log('GOD');
      return rawDate.toISOString().substring(0, 10);
    }},
    digest: String,
    email: String,
    familyName: String,
    givenName: String,
    owner: {type: String, default: null},
    phoneNumber: String,
    salt: String,
    tags: [String],
    updatedAt: {type: Date, default: Date.now}
  },

  methods: [
    function tidy() {
      this.id = this._id;
      this._id = this.__v = undefined;

      this.digest = undefined;
      this.salt = undefined;
    }
  ]
};
