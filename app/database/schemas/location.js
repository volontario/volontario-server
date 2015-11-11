module.exports = function(mongoose) {
  return new mongoose.Schema({
    addedAt: {type: Date, default: Date.now},
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    title: String,
    url: String,
    updatedAt: {type: Date, default: Date.now}
  });
};
