module.exports = function(req, res, next) {
  const queryKeys = Object.keys(req.query);
  const parsedQuery = queryKeys.reduce(function(parsedQuery, keychain) {
    const keys = keychain.split('.');
    const value = req.query[keychain];

    let curObj = parsedQuery;
    for (let i = 0; i < keys.length - 1; ++i) {
      const curKey = keys[i];
      let nextObj;
      if (curObj.hasOwnProperty(curKey)) {
        nextObj = curObj[curKey];
      } else {
        nextObj = {};
      }

      curObj[curKey] = nextObj;
      curObj = nextObj;
    }

    curObj[keys[keys.length - 1]] = value;

    return parsedQuery;
  }, {});

  req.query = parsedQuery;

  next();
};
