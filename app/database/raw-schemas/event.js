module.exports = {
  addedAt: {type: Date, default: Date.now},
  calendar: [
    {
      userId: String,
      from: Date,
      to: Date
    }
  ],
  category: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  endsAt: Date,
  name: String,
  originalId: String,
  origin: String,
  ownerId: {type: String, default: null},
  startsAt: Date,
  url: String,
  updatedAt: {type: Date, default: Date.now}
};
