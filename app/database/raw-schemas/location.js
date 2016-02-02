module.exports = {
  addedAt: {type: Date, default: Date.now},
  category: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  name: String,
  ownerId: {type: String, default: null},
  url: String,
  updatedAt: {type: Date, default: Date.now}
};
