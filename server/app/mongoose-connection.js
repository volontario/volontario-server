module.exports = (function() {
  var config = require('config');
  var mongoose = require('mongoose');

  var db = mongoose.connection;
  var schemas = {};

  var locationSchema = new mongoose.Schema({
    'category': String,
    'location': {
      'latitude': Number,
      'longitude': Number
    }
  });

  schemas.Location = mongoose.model('Location', locationSchema);

  mongoose.connect(config.get('mongo').url);

  return {
    db: db,
    schemas: schemas
  };
}());
