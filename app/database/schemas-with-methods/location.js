module.exports = function(mongoose) {
  const fields = {
    addedAt: {type: Date, default: Date.now},
    category: {type: String, required: true},
    coordinates: {
      latitude: {type: Number, required: true},
      longitude: {type: Number, required: true}
    },
    name: {type: String, required: true},
    ownerId: {type: String, required: true, default: null},
    url: {type: String, required: true},
    updatedAt: {type: Date, default: Date.now}
  };

  const Schema = new mongoose.Schema(fields);

  return Schema;
};
