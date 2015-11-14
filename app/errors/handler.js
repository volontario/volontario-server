module.exports = function(app) {
  app.use(function(err, _req, res, _next) { // eslint-disable-line no-unused-vars
    /**
     * Error messages may be split into a head and a body. The head part
     * contains the descriptor for the error. The body part contains extra
     * information for the API user.
     */
    let errorMessageHead = err.message.split(':', 1)[0];

    let statusCode = (function(errorMessage) {
      switch (errorMessage) {
        case 'User not found':
          return 404;
        case 'Bad path':
        case 'Bad resource ID':
        case 'Missing fields':
        case 'Possibly too vague':
          return 422;
        default:
          return 500;
      }
    })(errorMessageHead);

    res.status(statusCode);
    res.json({error: err.message});
  });
};
