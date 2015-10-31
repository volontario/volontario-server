module.exports = (function() {
  var prefixGet = function(body) {
    var environment = process.env.NODE_ENV || 'development';
    var id = 'VOLONTARIO_' + environment + '_' + body;
    var upperCaseId = id.toUpperCase();
    return process.env[upperCaseId];
  };

  return {
    EXPRESS_PORT: prefixGet('EXPRESS_PORT'),
    MONGO_URL: prefixGet('MONGO_URL'),
    MONGO_USERNAME: prefixGet('MONGO_USERNAME'),
    MONGO_PASSWORD: prefixGet('MONGO_PASSWORD'),
  };
}());
