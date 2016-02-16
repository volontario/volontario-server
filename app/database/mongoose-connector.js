module.exports = function(config, mongoose) {
  const rawEvent = require('./schemas-with-methods/event.js');
  const rawLocation = require('./schemas-with-methods/location.js');
  const rawUser = require('./schemas-with-methods/user.js');

  const schemaFactory = function(name, schemaWithMethods) {
    let Schema = new mongoose.Schema(schemaWithMethods.schema);

    schemaWithMethods.methods.forEach(function(method) {
      Schema.methods[method.name] = method;
    });

    Schema.set('toJSON', {getters: true});

    return mongoose.model(name, Schema);
  };

  const schemas = {
    Event: schemaFactory('event', rawEvent),
    Location: schemaFactory('location', rawLocation),
    User: schemaFactory('user', rawUser)
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
