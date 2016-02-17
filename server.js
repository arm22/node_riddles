//Require Express & body-parser
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//Set the app to use the body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//DB client
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/node_riddles';

app.get('/random', (req, res) => {
	res.writeHead(200, {"Content-Type": "application/json"});
	var data = getRandom((data) => {
		res.end(JSON.stringify(data));
	});
});

app.post('/random', (req, res) => {
	//need slack token
	if (req.body.token === key) {
		var data = getRandom((data) => {
			var question = data.question.replace(/\r?\n|\r/g, " ");
			res.end(JSON.stringify(question));
		});
	}
});

//common function to get a random riddle
function getRandom(callback) {
	//Create connection to server
	MongoClient.connect(url, (err, db) => {
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