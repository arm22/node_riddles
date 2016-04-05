//Require request
const request = require('request');
function send(job, done) {
  request({
    uri: job.data.uri,
    method: job.data.method,
    json: job.data.json
  });
  done();
};