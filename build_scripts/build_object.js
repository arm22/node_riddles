//Require jsdom library
const jsdom = require("jsdom");
//DB client
const MongoClient = require('mongodb').MongoClient;
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';
//Number of pages we need to scrape
const num_pages = 1;
//The base url we are scraping
const base = "https://www.riddles.com/";
//Json object of riddles
var data = [];

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
		  			data.push(jsonObj);
		  			if (data.length == num_pages) {
		  				//Use connect method to connect to the Server 
						MongoClient.connect(url, (err, db) => {
							if (err) {
								console.log(err);
							} else {
								console.log("Connected correctly to server");

								//Insert all the documents and set callback function to close the db
								insertDocuments(db, data, () => {
									db.close();
								});
							}
						});
		  			}
	  			}
	  		}
	});
};

function insertDocuments(db, documents, callback) {
	var collection = db.collection('riddles');
	// Insert some documents 
	collection.insertMany(documents, (err, result) => {
    	assert.equal(err, null);
    	console.log("success");
		callback(result);
	});
};

for (var i = 2; i <= num_pages+1; i++) {
	setTimeout(makeRequest(base + i.toString()), 300);
};