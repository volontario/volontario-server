module.exports = function(config, mongoose) {
  let eventFields = {
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
    name: String,
    originalId: String,
    origin: String,
    owner: {type: String, default: null},
    url: String,
    updatedAt: {type: Date, default: Date.now}
  };

  let locationFields = {
    addedAt: {type: Date, default: Date.now},
    category: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    name: String,
    owner: {type: String, default: null},
    url: String,
    updatedAt: {type: Date, default: Date.now}
  };

  let userFields = {
    addedAt: {type: Date, default: Date.now},
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    dateOfBirth: Date,
    email: String,
    familyName: String,
    givenName: String,
    owner: {type: String, default: null},
    phoneNumber: String,
    tags: [String],
    updatedAt: {type: Date, default: Date.now}
  };

  let schemaFactory = function(name, fields) {
    let Schema = new mongoose.Schema(fields);

    Schema.set('toJSON', {
      transform: function(_es, result) {
        result.id = result._id;
        result._id = result.__v = undefined;
      }
    });

    return mongoose.model(name, Schema);
  };

  let schemas = {
    Event: schemaFactory('event', eventFields),
    Location: schemaFactory('location', locationFields),
    User: schemaFactory('user', userFields)
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
