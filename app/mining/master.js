module.exports = function(schemas) {
  return {
    _requireMiner: function(name) {
      return require(`./miners/${name}/miner.js`);
    },

    mine: function(name) {
      const miner = this._requireMiner(name);
      miner(schemas);
    }
  };
};
