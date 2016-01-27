const https = require('https');
const jsdom = require("jsdom");

//Function that makes requests to the parameterized url
function makeRequest(url) {
	var document = "";
	//Make the request, logging the status code and headers
	https.get(url, (res) => {
		console.log('statusCode: ', res.statusCode);
		console.log('headers: ', res.headers);

		//Chunk the data and write it out
		res.on('data', (d) => {
			document = jsdom.jsdom(d);
		});

		//Handle the end of the response
		res.on('end', () => {
			console.log('\nResponse End');
			return document;
		});

	//Handle errors
	}).on('error', (e) => {
		console.error(e);
	});
};

for (var i = 1; i <= 2; i++) {
	console.log(makeRequest('https://www.riddles.com/' + i));
};