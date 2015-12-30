module.exports = function(LocationSchema) {
  let read = require('read-file');
  let path = require('path');

  let pathToInput = path.join(__dirname, '/input.json');

  let inputLocations = JSON.parse(read.sync(pathToInput));

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
