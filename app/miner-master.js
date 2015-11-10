module.exports = function(schemas) {
  return {
    _requireMiner: function(name) {
      return require(`./miners/${name}.js`);
    },

    mine: function(name) {
      let miner = this._requireMiner(name);
      miner(schemas);
    }
  };
};
