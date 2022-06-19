const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
const maxApi = require('max-api');
const { StringDecoder } = require('string_decoder');
const path = require('path');

var trends = JSON.parse(fs.readFileSync("json/twitter_all_trends.json"));
var languages = JSON.parse(fs.readFileSync("json/languages.json"));

var myKey = ""; // set your API key
var language = "fr-fr"; // default to french
var numbOfTrends = 5; // default to 5 trends

maxApi.addHandler('set_VOICERSS_API_KEY', (apiKey) => {
	myKey = apiKey;
	maxApi.outlet("print "+"API key set to "+myKey);
});

maxApi.addHandler('set_numbOfTrends', (xoft) => {
	numbOfTrends = xoft;
	maxApi.outlet("print "+"number of trends set to "+xoft);
});

maxApi.addHandler('clearFiles', () => {
	Object.keys(trends).forEach(function(key1) {
		var pathToCountry = "sounds/"+key1;
		
		fs.readdir(pathToCountry, (err, files) => { 		
				if (err) {
					console.log(err);
				} else {
					if (!files.length) {
						console.log("Directory "+key1+" is already empty.");
					} else {
						for (const file of files) {
							fs.unlink(path.join(pathToCountry, file), err => {
	  						if (err) throw err;
	  						console.log('deleted '+file);
						});
					}}}
		});
	});	
});

// main API call that writes down soundfiles for all trends in all countries

maxApi.addHandler('callAndWrite', () => {

	Object.keys(trends).forEach(function(key) { // pour chaque pays

		for (var i=0; i<numbOfTrends; i++){ // pour chaque trend
			console.log("writing");
			const words = trends[key][i]["name"];
			const tweetVolume = trends[key][i]["tweet_volume"]; // volume de tweets
			const urlWords = encodeURI(words);

			const fileWords = words.replace(/ /g,"_").replace(/\./g,"").replace(/\!/g,"").replace(/\?/g,"");
			// fileName = "tts_"+fileWords+".wav"; // change here for country refactoring
			fileName = "sounds/"+key+"/tts_"+key+"_"+fileWords+"_"+tweetVolume+".wav";
			if (fs.existsSync(fileName)) {
				// just in case
				maxApi.outlet("exists "+fileName);
				return;
			}
		  
			var errorMessage = "";
			var isError = false;
			const file = fs.createWriteStream(fileName);
			const request = http.get("http://api.voicerss.org/?key="+myKey+"&hl="+languages[key]+"&f=48khz_16bit_stereo&src="+words, function(response) {
				response.pipe(file);	
				response.on('data', function (chunk) {
					const decoder = new StringDecoder('utf8');
			    isError = decoder.write(chunk).startsWith("ERROR")
			    errorMessage = decoder.write(chunk)
			  });
			  response.on('end', function () {
			  	if(isError){
			  		maxApi.outlet("error "+errorMessage);
			  	}else{
						maxApi.outlet("success "+fileName);
			  	}
			  	console.log("isError: "+isError);

			  });	
			});

		}
	});

});



