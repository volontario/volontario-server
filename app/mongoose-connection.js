module.exports = function(config) {
  ['MONGO_URL', 'MONGO_USERNAME', 'MONGO_PASSWORD'].forEach(function(envvar) {
    if (config[envvar] === undefined) {
      throw new Error('Mongo is missing ' + envvar);
    }
  });

  var mongoose = require('mongoose');

  var db = mongoose.connection;
  var schemas = {};

  var eventSchema = new mongoose.Schema({
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

  var locationSchema = new mongoose.Schema({
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    title: String,
    url: String
  });

  var userSchema = new mongoose.Schema({
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
