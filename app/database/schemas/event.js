module.exports = function(mongoose) {
  let EventSchema = new mongoose.Schema({
    addedAt: {type: Date, default: Date.now},
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    name: String,
    originalId: String,
    origin: String,
    url: String,
    updatedAt: {type: Date, default: Date.now}
  });

  EventSchema.set('toJSON', {
    transform: function(_es, result) {
      result.id = result._id;
      result._id = result.__v = undefined;
    }
  });

  return EventSchema;
};
