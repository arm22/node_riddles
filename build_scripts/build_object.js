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
	  				var title = window.$('h1.panel-title[itemprop="name"]').first().text();
  					var body = window.$('.panel-body div[itemprop="text"] p');
		  			var question = body[0].innerHTML;
		  			var answer = body[1].innerHTML;
		  			var jsonObj = {
		  				title: title,
		  				quesiton: question,
		  				answer: answer
		  			};
		    		console.log(jsonObj);
	  			} else {
	  				console.log("Error: " + err);
	  			}
	  		}
	});
};

makeRequest('https://www.riddles.com/2');