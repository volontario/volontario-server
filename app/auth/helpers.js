const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');

module.exports = {
  digest: function(password, salt) {
    if (typeof password !== String || typeof salt !== String) {
      return null;
    }

    return pbkdf2
      .pbkdf2Sync(password, salt, 16384, 128, 'sha512')
      .toString('hex');
  },

  generateSalt: function() {
    return crypto.randomBytes(128).toString('hex');
  },
};
