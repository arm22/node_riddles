//Require jsdom library
const jsdom = require("jsdom");
var data = [];

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
		  			data.push(jsonObj);
		  			console.log(data);
	  			}
	  		}
	});
};


for (var i = 2; i <= 5; i++) {
	makeRequest("https://www.riddles.com/" + i.toString());
};
