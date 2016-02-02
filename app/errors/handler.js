module.exports = function(app) {
  app.use(function(err, _req, res, _next) { // eslint-disable-line no-unused-vars
    /**
     * Error messages may be split into a head and a body. The head part
     * contains the descriptor for the error. The body part contains extra
     * information for the API user.
     */
    const errorMessageHead = err.message.split(':', 1)[0];

    const statusCode = (function(errorMessage) {
      switch (errorMessage) {
        case 'Authentication failed':
          return 401;
        case 'Calendar item not found':
        case 'User not found':
          return 404;
        case 'Bad path':
        case 'Bad resource ID':
        case 'Missing fields':
        case 'Possibly too vague':
          return 422;
        case 'Database error':
          return 500;
        case 'Unsupported operation':
          return 501;
        default:
          console.log(`undefined error: ${err}`);
          return 500;
      }
    })(errorMessageHead);

    res.status(statusCode);
    res.json({error: err.message});
  });
};
