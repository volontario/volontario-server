module.exports = (function() {
  var prefixGet = function(body) {
    var id = 'VOLONTARIO_' + process.env.NODE_ENV.toUpperCase() + '_' + body;
    return process.env[id];
  };

  return {
    EXPRESS_PORT: prefixGet('EXPRESS_PORT'),
    MONGO_URL: prefixGet('MONGO_URL'),
    MONGO_USERNAME: prefixGet('MONGO_USERNAME'),
    MONGO_PASSWORD: prefixGet('MONGO_PASSWORD'),
  };
}());
