module.exports = (function() {
  const environment = process.env.NODE_ENV || 'production';

  const prefixGet = function(body) {
    const id = `VOLONTARIO_${environment}_${body}`;
    const upperCaseId = id.toUpperCase();

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
    MONGO_PASSWORD: prefixGet('MONGO_PASSWORD'),
    AUTH_CALLBACK: prefixGet('AUTH_CALLBACK'),
    FACEBOOK_AUTH_ID: prefixGet('FACEBOOK_AUTH_ID'),
    FACEBOOK_AUTH_SECRET: prefixGet('FACEBOOK_AUTH_SECRET'),
    FACEBOOK_AUTH_CALLBACK: prefixGet('FACEBOOK_AUTH_CALLBACK')
  };
})();
