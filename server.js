//Need http
var http = require("http");
//DB client
const MongoClient = require('mongodb').MongoClient;
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';

//Create server
var server = http.createServer((req, res) => {
	//handle favicon route
	if (req.method === 'GET' && req.url === '/favicon.ico') {
		res.statusCode = 404;
		res.end();
	//handle main get request
	} else if (req.method === 'GET') {
		res.writeHead(200, {"Content-Type": "application/json"});
		//Create connection to server
		MongoClient.connect(url, (err, db) => {
			if (err) {
				console.log("Mongo Error: " + err);
			} else {
				console.log("Connected correctly to server");
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
	//handle all other routes
	} else {
		res.statusCode = 404;
		res.end();
	}	
});

//start server
server.listen(8080);
console.log("Server is listening");