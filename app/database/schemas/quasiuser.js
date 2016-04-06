module.exports = function(mongoose) {
  const fields = {
    callback: String,
    authId: String
  };

  return new mongoose.Schema(fields);
};
