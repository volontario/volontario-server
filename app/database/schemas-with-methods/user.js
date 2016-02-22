module.exports = function(mongoose) {
  const fields = {
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
  };

  const Schema = new mongoose.Schema(fields);

  Schema.methods.tidy = function() {
    this.digest = undefined;
    this.salt = undefined;
  };

  return Schema;
};
