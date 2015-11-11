module.exports = function(mongoose) {
  return new mongoose.Schema({
    addedAt: {type: Date, default: Date.now},
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    dateOfBirth: Date,
    email: String,
    familyName: String,
    givenName: String,
    phoneNumber: String,
    tags: [String],
    updatedAt: {type: Date, default: Date.now}
  });
};
