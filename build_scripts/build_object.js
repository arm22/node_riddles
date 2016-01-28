//Require jsdom library
const jsdom = require("jsdom");

//Function that makes requests to the parameterized url
function makeRequest(urls) {
	//Set jsdom environment
	jsdom.env({
		url: urls,
			//Parse html with jquery
	  		scripts: ["http://code.jquery.com/jquery.js"],
	  		done: (err, window) => {
	  			if (err == null) {
  					var element = window.$('.panel-body div[itemprop="text"] p');
		  			var riddle = typeof element[0];
		  			var answer = typeof element[1];
		    		console.log(riddle, answer);
	  			} else {
	  				console.log("Error: " + err);
	  			}
	  		}
	});
};

makeRequest('https://www.riddles.com/2');