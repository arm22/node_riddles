//Need http
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//DB client
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/node_riddles';

app.get('/random', (req, res) => {
	res.writeHead(200, {"Content-Type": "application/json"});
		//Create connection to server
		MongoClient.connect(url, (err, db) => {
			if (err) {
				console.log("Mongo Error: " + err);
			} else {
				console.log("Connected correctly to DB");
				var collection = db.collection('riddles');
				//Query for a random riddle from mongo
				collection.aggregate([{ $sample: { size: 1 }}], (err, docs) => {
					if (err) {
						console.log("Mongo Error: " + err);
					} else {
						//end response with random riddle in JSON
						db.close();
						res.end(JSON.stringify(docs[0]))
					}
				});
			}
		});
});

app.post('/random', (req, res) => {
	//need slack token
	console.log(req.body.token);
	if (req.body.token === key) {
		//Create connection to server
		MongoClient.connect(url, (err, db) => {
			if (err) {
				console.log("Mongo Error: " + err);
				res.writeHead(404);
			} else {
				console.log("Connected correctly to DB");
				var collection = db.collection('riddles');
				//Query for a random riddle from mongo
				collection.aggregate([{ $sample: { size: 1 }}], (err, docs) => {
					if (err) {
						console.log("Mongo Error: " + err);
						res.writeHead(404);
					} else {
						//end response with random riddle in JSON
						db.close();
						riddle = docs[0];
						json_resp = {
							"response_type": "in_channel",
							"text": riddle.question
						}
						res.writeHead(200, {"Content-Type": "application/json"});
						res.end(JSON.stringify(json_resp));
					}
				});
			}
		});
		// {
	 //    "response_type": "in_channel",
	 //    "text": "It's 80 degrees right now.",
	 //    "attachments": [
	 //        {
	 //            "text":"Partly cloudy today and tomorrow"
	 //        }
	 //    ]
		// }
	} else {
		res.writeHead(404);
	}
});

//start server
app.listen(8080,() => {
  console.log('Example app listening on port 8080!');
});