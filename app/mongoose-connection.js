module.exports = function(config) {
  let mongoose = require('mongoose');

  let db = mongoose.connection;
  let schemas = {};

  let eventSchema = new mongoose.Schema({
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

  let locationSchema = new mongoose.Schema({
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    title: String,
    url: String
  });

  let userSchema = new mongoose.Schema({
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    dateOfBirth: Date,
    email: String,
    familyName: String,
    givenName: String,
    phoneNumber: String,
    tags: [String]
  });

  schemas.Event = mongoose.model('Event', eventSchema);
  schemas.Location = mongoose.model('Location', locationSchema);
  schemas.User = mongoose.model('User', userSchema);

  mongoose.connect(config.MONGO_URL, {
    user: config.MONGO_USERNAME,
    password: config.MONGO_PASSWORD
  });

  return {
    db: db,
    schemas: schemas
  };
};
