var fs = require('fs');
var express = require("express");
var parser = require("body-parser");
var app = express();

app.use(parser.urlencoded({extended : true}));

app.set('view engine', 'jade');

app.get("/newnum", function(request, response) {
	var primes = fs.readFileSync('./data/listofprimes.txt', {encoding:'utf8', flag:'r'});
	var primeList = primes.split('\r\n');
	var done = false;
	var toReturn = '';
	for (var i = 0; i < primeList.length && !done; i++) {
		var sections = primeList[i].split(' '); //epoch time is 13 chars
		if (sections[1] == '0') { //0 is not done, 1 is in progress, removed once checked
			done = true; //will exit for loop
			toReturn = sections[0]; //number is section with index 0, so thats what it returns
			primeList[i] = sections[0] + ' 1 ' + Date.now().toString();
		} else if (sections[1] == '1') {
			if (Date.now() - 432000000 > parseInt(sections[2])) {
				primeList[i] = sections[0] + ' 0';
			}
		}
		fs.writeFileSync('./data/listofprimes.txt', primeList.join('\r\n'));
	}

	console.log(toReturn);
	response.send(toReturn);
})

app.listen(80);

console.log('started');