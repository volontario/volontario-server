module.exports = function(mongoose) {
  let LocationSchema = new mongoose.Schema({
    addedAt: {type: Date, default: Date.now},
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    name: String,
    url: String,
    updatedAt: {type: Date, default: Date.now}
  });

  LocationSchema.set('toJSON', {
    transform: function(_es, result) {
      result.id = result._id;
      result._id = result.__v = undefined;
    }
  });

  return LocationSchema;
};
