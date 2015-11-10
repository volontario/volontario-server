module.exports = function(mongoose) {
  return new mongoose.Schema({
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    title: String,
    url: String
  });
};
