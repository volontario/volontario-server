module.exports = function(LocationSchema) {
  const read = require('read-file');
  const path = require('path');

  const pathToInput = path.join(__dirname, '/input.json');

  const inputLocations = JSON.parse(read.sync(pathToInput));

  inputLocations.forEach(function(loc) {
    LocationSchema.findOneAndUpdate(
      {originalId: loc.id},
      loc,
      {upsert: true},
      function(error) {
        if (error) {
          console.log(error);
        }
      }
    );
  });
};
