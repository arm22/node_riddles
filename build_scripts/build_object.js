//Require jsdom library
const jsdom = require("jsdom");
//DB client
const MongoClient = require('mongodb').MongoClient;
// Connection URL 
var url = 'mongodb://localhost:27017/node_riddles';
//Page to start scraping
const start_page = 2;
//Page to end scraping
const end_page = 50
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
	  				console.log("JSDOM Error: " + err);
	  			} else {
	  				var jsonObj;
	  				var title = window.$('h1.panel-title[itemprop="name"]').first().text();
	  				var question = window.$('.panel-body div[itemprop="text"]').first().text().trim();
  					var answer = window.$('.panel-body .well div[itemprop="text"]').first().text().trim();
		  			window.close();
		  			//Build riddle object
		  			jsonObj = {
		  				title : title,
		  				question : question,
		  				answer : answer
		  			};
		  			data.push(jsonObj);
		  			if (data.length == (end_page - start_page)) {
		  				//Use connect method to connect to the Server 
						MongoClient.connect(url, (err, db) => {
							if (err) {
								console.log("Mongo Error: " + err);
							} else {
								console.log("Connected correctly to server");
								var collection = db.collection('riddles');
								//Insert all the documents and close db
								collection.insertMany(data, (err, result) => {
							    	if (err) {
							    		console.log(err);
							    	} else {
							    		console.log("success");
											db.close();
									}
								});
							}
						});
		  			}
	  			}
	  		}
	});
};

for (var i = start_page; i <= end_page; i++) {
	setTimeout(makeRequest(base + i.toString()), 300);
};