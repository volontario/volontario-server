module.exports = function(mongooseConnection, subordinate) {
  var miner = require('./miners/' + subordinate + '.js');

  miner(mongooseConnection);
};
