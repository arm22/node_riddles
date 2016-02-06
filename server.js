var http = require("http");
var server = http.createServer((request, response) => {
	response.writeHead(200, {"Content-Type": "application/json"});
	var data = JSON.stringify({ message: "Hello world"});
	response.end(data);
});

server.listen(8080);
console.log("Server is listening");
