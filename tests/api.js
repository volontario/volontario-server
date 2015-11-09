module.exports = function() {
  const DEFAULT_HOST = 'localhost';
  const DEFAULT_PORT = 8080;

  let frisby = require('frisby');

  let host = process.env.VOLONTARIO_EXPRESS_HOST || DEFAULT_HOST;
  let port = process.env.VOLONTARIO_EXPRESS_PORT || DEFAULT_PORT;
  let url = 'http://' + host + ':' + port;
  console.log(url);
  frisby.create('Make sure the API returns something')
    .get(url)
    .expectStatus(200)
    .expectBodyContains('{}')
    .toss();
};
