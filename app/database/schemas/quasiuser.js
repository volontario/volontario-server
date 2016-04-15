module.exports = function(mongoose) {
  const fields = {
    addedAt: {type: Date, default: Date.now},
    externalIds: Object
  };

  return new mongoose.Schema(fields);
};
