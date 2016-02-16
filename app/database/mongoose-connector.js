module.exports = function(config, mongoose) {
  const rawEvent = require('./raw-schemas/event.js');
  const rawLocation = require('./raw-schemas/location.js');
  const rawUser = require('./raw-schemas/user.js');

  const schemaFactory = function(name, fields) {
    const Schema = new mongoose.Schema(fields);

    Schema.set('toJSON', {
      transform: function(_es, result) {
        result.id = result._id;
        result._id = result.__v = undefined;

        if (result.calendar) {
          result.calendar.forEach(function(item) {
            item.id = item._id;
            item._id = undefined;

            if (item.userApproved === false && item.hostApproved === false) {
              item.approvalStatus = 'removed';
            }
            if (item.userApproved === false && item.hostApproved === true) {
              item.approvalStatus = 'cancelled';
            }
            if (item.userApproved === true && item.hostApproved === false) {
              item.approvalStatus = 'pending';
            }
            if (item.userApproved === true && item.hostApproved === true) {
              item.approvalStatus = 'approved';
            }
          });
        }

        if (result.dateOfBirth) {
          result.dateOfBirth =
            result.dateOfBirth.toISOString().substring(0, 10);
        }
      }
    });

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
