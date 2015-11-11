module.exports = function(mongoose) {
  let UserSchema = new mongoose.Schema({
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

  UserSchema.set('toJSON', {
    transform: function(_es, result) {
      result.id = result._id;
      result._id = result.__v = undefined;
    }
  });

  return UserSchema;
};
