//Require Express & body-parser
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//Set the app to use the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Use nconf for keystore
const nconf = require('nconf');
nconf.file({file: './keys.json'});
//DB client
const MongoClient = require('mongodb').MongoClient;

app.get('/random', (req, res) => {
	res.writeHead(200, {"Content-Type": "application/json"});
	var data = getRandom((data) => {
		res.end(JSON.stringify(data));
	});
});

app.post('/random', (req, res) => {
	if (req.body.token === nconf.get('token')) {
		var data = getRandom((data) => {
			//Replace any whitespace
			var question = data.question.replace(/\r?\n|\r/g, " ");
			var answer = data.answer.replace(/\r?\n|\r/g, " ");
			//Build slack response
			var response = {
								    "response_type": "ephemeral",
								    "text": question,
								    "attachments": [
								        {
								            "text":"Answer: " + answer
								        }
								    ]
								};
			//Set the header and end the response stream
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(response));
		});
	}
});

//common function to get a random riddle
function getRandom(callback) {
	//Create connection to server
	MongoClient.connect("mongodb://" + nconf.get('mongodb:host') + ":" + nconf.get('mongodb:port') + "/" + nconf.get('mongodb:collection'), (err, db) => {
		if (err) {
			throw err;
		} else {
			var collection = db.collection('riddles');
			//Query for a random riddle from mongo
			collection.aggregate([{ $sample: { size: 1 }}], (err, docs) => {
				if (err) {
					throw err;
				} else {
					//return the riddle data
					db.close();
					callback(docs[0]);
				}
			});
		}
	});
}

//start server
app.listen(8080,() => {
  console.log('Node Riddles listening on port 8080!');
});