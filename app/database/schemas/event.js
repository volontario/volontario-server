module.exports = function(mongoose) {
  return new mongoose.Schema({
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    name: String,
    originalId: String,
    origin: String,
    url: String
  });
};
