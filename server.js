const fs = require('fs');
const https = require('https');
const kue = require('kue');
//Require Express & body-parser
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//Set the app to use the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//Use nconf for keystore
const nconf = require('nconf');
nconf.file({file: './keys.json'});

//Connect to redis
const q = kue.createQueue({
  prefix: 'q',
  redis: {
    host: nconf.get('redis:host'),
    port: nconf.get('redis:port'),
    db: nconf.get('redis:db')
  }
});

q.process('post-resp', function(job, done){
  send(job, done);
});

function send(job, done) {
  request({
    uri: job.data.uri,
    method: job.data.method,
    json: job.data.json
  });
  done();
};

var options = {
  ca: fs.readFileSync('ssl/www_slack-riddle_xyz.ca-bundle'),
  key: fs.readFileSync('ssl/private-key.key'),
  cert: fs.readFileSync('ssl/www_slack-riddle_xyz.crt')
}
//Start server
https.createServer(options, app).listen(443);

app.get('/random', (req, res) => {
	var data = getRandom((data) => {
		//Replace any whitespace
		var question = data.question.replace(/\r?\n|\r/g, " ");
		var answer = data.answer.replace(/\r?\n|\r/g, " ");
		//Build JSON riddle
		var message = {
			"question": question,
			"answer": answer
		};
		//Set the header and end the response stream
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(message));
	});
});

app.post('/random', (req, res) => {
	if (req.body.token === nconf.get('token')) {
    var text = req.body.text;
    //Respond to help command
    if (text.toLowerCase() === "help") {
      var message = {
        "response_type": "ephemeral",
        "text": "`/riddle` is used to send a riddle into slack. Include a number of minutes to wait for an answer. For example `/riddle 5min` would post a riddle, and an answer 5 minutes later."
      }
      //Set the header and end the response stream
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(message));
    } else {
      //Convert param to int
      var wait = parseInt(req.body.text);
  		var data = getRandom((data) => {
  			//Replace any whitespace
  			var question = data.question.replace(/\r?\n|\r/g, " ");
  			var answer = data.answer.replace(/\r?\n|\r/g, " ");
  			//Build slack riddle
  			var message = {
  								    "response_type": "in_channel",
                      "text": "Riddle:",
                      "attachments": [
                        {
                          "text": question
                        }
                      ]
  								};
        
        if (!isNaN(wait)) {
          var send_time = new Date();
          send_time.setMinutes(send_time.getMinutes() + wait);
          //If wait is a number
          var data = q.create('post-resp', {
            uri: req.body.response_url,
            method: "POST",
            json: {
              "response_type": "in_channel",
              "text": "Answer:",
              "attachments": [
                        {
                          "text": answer
                        }
                      ]
            }
          }).delay(send_time)
          .save();
        } else {
          //If wait is not a number

        }
  			//Set the header and end the response stream
  			res.writeHead(200, {"Content-Type": "application/json"});
  			res.end(JSON.stringify(message));
  		});
    }
	}
});




