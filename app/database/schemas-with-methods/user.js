module.exports = {
  schema: {
    addedAt: {type: Date, default: Date.now},
    coordinates: {
      latitude: {type: Number, required: true},
      longitude: {type: Number, required: true}
    },
    dateOfBirth: {type: Date, required: true, get: function(rawDate) {
      return rawDate.toISOString().substring(0, 10);
    }},
    digest: String,
    email: {type: String, required: true, unique: true},
    familyName: {type: String, required: true},
    givenName: {type: String, required: true},
    owner: {type: String, default: null},
    phoneNumber: {type: String, required: true},
    salt: String,
    tags: [String],
    updatedAt: {type: Date, default: Date.now}
  },

  methods: [
    function tidy() {
      this.digest = undefined;
      this.salt = undefined;
    }
  ]
};
