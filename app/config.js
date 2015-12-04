module.exports = (function() {
  const environment = process.env.NODE_ENV || 'production';

  const prefixGet = function(body) {
    let id = `VOLONTARIO_${environment}_${body}`;
    let upperCaseId = id.toUpperCase();

    if (process.env[upperCaseId] === undefined) {
      throw new Error(`Missing envvar: ${upperCaseId}`);
    }

    return process.env[upperCaseId];
  };

  const expressPort = (function() {
    if (process.env.PORT) {
      return process.env.PORT;
    } else if (prefixGet('EXPRESS_PORT')) {
      return prefixGet('EXPRESS_PORT');
    }

    throw new Error('Neither $VOLONTARIO_$ENV_EXPRESS_PORT nor $PORT is set');
  })();

  return {
    ENVIRONMENT: environment,
    EXPRESS_PORT: expressPort,
    MONGO_URL: prefixGet('MONGO_URL'),
    MONGO_USERNAME: prefixGet('MONGO_USERNAME'),
    MONGO_PASSWORD: prefixGet('MONGO_PASSWORD')
  };
})();
