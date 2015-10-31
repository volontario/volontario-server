module.exports = function(config) {
  var mongoose = require('mongoose');

  var db = mongoose.connection;
  var schemas = {};

  var eventSchema = new mongoose.Schema({
    'category': String,
    'coordinates': {
      'latitude': Number,
      'longitude': Number
    },
    'name': String,
    'original_id': String,
    'url': String
  });

  var locationSchema = new mongoose.Schema({
    'category': String,
    'coordinates': {
      'latitude': Number,
      'longitude': Number
    }
  });

  schemas.Event = mongoose.model('Event', eventSchema);
  schemas.Location = mongoose.model('Location', locationSchema);

  mongoose.connect(config.MONGO_URL, {
    user: config.MONGO_USERNAME,
    password: config.MONGO_PASSWORD
  });

  return {
    db: db,
    schemas: schemas
  };
};