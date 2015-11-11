module.exports = function(mongoose) {
  return new mongoose.Schema({
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
};
