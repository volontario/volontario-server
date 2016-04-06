module.exports = function(config, mongoose) {
  const schemaFactory = function(name) {
    const schemeCreator = require(`./schemas/${name}.js`);
    const Schema = schemeCreator(mongoose);

    Schema.set('toJSON', {getters: true});

    Schema.options.toJSON.transform = function(_, json) {
      const renameIdRec = function(doc) {
        if (doc.constructor.name !== 'Object') {
          return;
        }

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
    Event: schemaFactory('event'),
    Location: schemaFactory('location'),
    User: schemaFactory('user'),
    Quasiuser: schemaFactory('quasiuser')
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
