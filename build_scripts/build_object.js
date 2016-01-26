const https = require('https');

//Function that makes requests to the parameterized url
function makeRequest(url) {
	//Make the request, logging the status code and headers
	https.get(url, (res) => {
		console.log('statusCode: ', res.statusCode);
		console.log('headers: ', res.headers);

		//Chunk the data and write it out
		res.on('data', (d) => {
			process.stdout.write(d);
		});

		//Handle the end of the response
		res.on('end', () => {
			console.log('\nResponse End')
		});

	//Handle errors
	}).on('error', (e) => {
		console.error(e);
	});
};

makeRequest('https://www.riddles.com/201');