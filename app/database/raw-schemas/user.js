module.exports = {
  addedAt: {type: Date, default: Date.now},
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  dateOfBirth: Date,
  digest: String,
  email: String,
  familyName: String,
  givenName: String,
  owner: {type: String, default: null},
  phoneNumber: String,
  salt: String,
  tags: [String],
  updatedAt: {type: Date, default: Date.now}
};
