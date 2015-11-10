module.exports = function(schemas, subordinate) {
  let miner = require(`./miners/${subordinate}.js`);

  miner(schemas);
};
