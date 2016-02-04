//Require jsdom library
const jsdom = require("jsdom");
//DB client
const MongoClient = require('mongodb').MongoClient;
//Assertion for DB
const assert = require('assert');
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';
//Number of pages we need to scrape
const num_pages = 10;
//The base url we are scraping
const base = "https://www.riddles.com/";
//Json object of riddles
var obj = {data : []};

//Function that makes requests to the parameterized url
function makeRequest(urls) {
	//Set jsdom environment
	jsdom.env({
		url: urls,
			//Parse html with jquery
	  		scripts: ["http://code.jquery.com/jquery.js"],
	  		done: (err, window) => {
	  			//Check for error
	  			if (err) {
	  				console.log("Error: " + err);
	  			} else {
	  				var jsonObj;
	  				var title = window.$('h1.panel-title[itemprop="name"]').first().text();
	  				var question = window.$('.panel-body div[itemprop="text"]').first().text().trim();
  					var answer = window.$('.panel-body .well div[itemprop="text"]').first().text().trim();
		  			window.close();
		  			//Build riddle object
		  			jsonObj = {
		  				title: title,
		  				quesiton: question,
		  				answer: answer
		  			};
	  			}
	  		}
	});
};

function insertDocuments(db, callback) {
	var collection = db.collection('documents');
	// Insert some documents 
	collection.insertMany([
		{a : 1}, {a : 2}, {a : 3}
  	], (err, result) => {
    	assert.equal(err, null);
    	assert.equal(3, result.result.n);
    	assert.equal(3, result.ops.length);
    	console.log("Inserted 3 documents into the document collection");
		callback(result);
	});
};

for (var i = 2; i <= num_pages+1; i++) {
	setTimeout(makeRequest(base + i.toString()), 300);
};

Use connect method to connect to the Server 
MongoClient.connect(url, (err, db) => {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	insertDocuments(db, () => {
		db.close();
	});
});