module.exports = function(schemas, subordinate) {
  var miner = require('./miners/' + subordinate + '.js');

  miner(schemas);
};
