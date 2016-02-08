//Need http
var http = require("http");
//DB client
const MongoClient = require('mongodb').MongoClient;
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';

var server = http.createServer((req, res) => {
	if (req.method === 'GET') {
		res.writeHead(200, {"Content-Type": "application/json"});
		var data = JSON.stringify({ message: "Hello world"});
		res.end(data);
	} else {
		res.statusCode = 404;
		res.end();
	}	
});

server.listen(8080);
console.log("Server is listening");
