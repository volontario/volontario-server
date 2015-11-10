module.exports = function(mongoose) {
  return new mongoose.Schema({
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    dateOfBirth: Date,
    email: String,
    familyName: String,
    givenName: String,
    phoneNumber: String,
    tags: [String]
  });
};
