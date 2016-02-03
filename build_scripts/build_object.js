//Require jsdom library
const jsdom = require("jsdom");
//DB client
const MongoClient = require('mongodb').MongoClient;
//Assertion for DB
const assert = require('assert');
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';
//Number of pages we need to scrape
const num_pages = 20;
//The base url we are scraping
const base = "https://www.riddles.com/";

// Use connect method to connect to the Server 
MongoClient.connect(url, (err, db) => {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	db.close();
});

//Function that makes requests to the parameterized url
function makeRequest(urls) {
	var jsonObj;
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
	  				var title = window.$('h1.panel-title[itemprop="name"]').first().text();
  					var body = window.$('.panel-body div[itemprop="text"] p');
		  			var question = body[0].innerHTML;
		  			var answer = body[1].innerHTML;
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


for (var i = 2; i <= num_pages+1; i++) {
	makeRequest(base + i.toString());
};