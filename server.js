//Need http
var http = require("http");
//DB client
const MongoClient = require('mongodb').MongoClient;
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';

var server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/favicon.ico') {
		res.statusCode = 404;
		res.end();
	} else if (req.method === 'GET') {
		res.writeHead(200, {"Content-Type": "application/json"});
		MongoClient.connect(url, (err, db) => {
			if (err) {
				console.log("Mongo Error: " + err);
			} else {
				console.log("Connected correctly to server");
				var collection = db.collection('riddles');
				var cursor = collection.aggregate([{ $sample: { size: 1 }}], (err, docs) => {
					if (err) {
						console.log("Mongo Error: " + err);
					} else {
						db.close();
						res.end(JSON.stringify(docs[0]))
					}
				});
			}
		});
	} else {
		res.statusCode = 404;
		res.end();
	}	
});

server.listen(8080);
console.log("Server is listening");
