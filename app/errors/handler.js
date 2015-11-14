module.exports = function(app) {
  app.use(function(err, _req, res, _next) { // eslint-disable-line no-unused-vars
    let statusCode = (function(errorMessage) {
      switch (errorMessage) {
        case 'Bad path':
          return 400;
        case 'User not found':
          return 404;
        default:
          return 500;
      }
    })(err.message);

    res.status(statusCode);
    res.json({error: err.message});
  });
};
