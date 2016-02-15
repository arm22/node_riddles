//Need http
const express = require('express');
const app = express();
//DB client
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/node_riddles';

app.get('/', (req, res) => {
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

//start server
app.listen(8080,() => {
  console.log('Example app listening on port 8080!');
});