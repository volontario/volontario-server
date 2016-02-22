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

    Schema.options.toJSON.transform = function(_, json) {
      const renameIdRec = function(doc) {
        console.log(doc);
        doc.id = doc._id;
        doc._id = doc.__v = undefined;

        for (let propKey in doc) {
          if (doc.hasOwnProperty(propKey) &&
              doc[propKey] &&
              doc[propKey].constructor.name === 'Array') {
            for (let i = 0; i < doc[propKey].length; ++i) {
              renameIdRec(doc[propKey][i]);
            }
          }
        }
      };

      renameIdRec(json);
    };

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
