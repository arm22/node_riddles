//Need request module
const request = require('request');

var sendreq = function(job, done) {
  request({
    uri: job.data.uri,
    method: job.data.method,
    json: job.data.json
  });
  done();
};
module.exports = sendreq;