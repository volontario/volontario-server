module.exports = (function() {
  var DEFAULT_PORT = 8080;

  var environment = process.env.NODE_ENV || 'development';

  var prefixGet = function(body) {
    var id = 'VOLONTARIO_' + environment + '_' + body;
    var upperCaseId = id.toUpperCase();
    return process.env[upperCaseId];
  };

  var expressPort = (function() {
    if (prefixGet('EXPRESS_PORT')) {
      return prefixGet('EXPRESS_PORT');
    } else if (process.env.PORT) {
      return process.env.PORT;
    }

    return DEFAULT_PORT;
  })();

  return {
    ENVIRONMENT: environment,
    EXPRESS_PORT: expressPort,
    MONGO_URL: prefixGet('MONGO_URL'),
    MONGO_USERNAME: prefixGet('MONGO_USERNAME'),
    MONGO_PASSWORD: prefixGet('MONGO_PASSWORD')
  };
})();
