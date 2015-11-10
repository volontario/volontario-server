module.exports = function(config, mongoose) {
  let loadSchema = name => require(`./schemas/${name}.js`)(mongoose);
  let schemas = {
    Event: mongoose.model('Event', loadSchema('event')),
    Location: mongoose.model('Location', loadSchema('location')),
    User: mongoose.model('User', loadSchema('user'))
  };

  mongoose.connect(config.MONGO_URL, {
    user: config.MONGO_USERNAME,
    password: config.MONGO_PASSWORD
  });

  return {
    db: mongoose.connection,
    schemas: schemas
  };
};
