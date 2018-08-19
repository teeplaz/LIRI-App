//Bob Helm 2018

require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");

function logData() {
		
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) throw error;
    var loggedTxt = data.split(",");
    var command = loggedTxt[0];
    var parameter = loggedTxt[1];
    userPicks(command, parameter);
  });
}

function getSpotify(songName){
  var Spotify = require("node-spotify-api");
  var spotify = new Spotify(keys.spotify);

  function getArtistNames(artist) {
    return artist.name;
  }
  
  spotify.search({ 
    type: "track", query: songName }, function(error, data) {
    if (error) {
        console.log(`Error is: ${error}`);
        return;
    }
    else {
      var songs = data.tracks.items; 
      for (let i = 0; i < songs.length; i++) {
          console.log (i);
          console.log(`Artist(s): ${songs[i].artists.map(getArtistNames)}`);
          console.log(`Song Name: ${songs[i].name}`);
          console.log(`Preview URL: ${songs[i].preview_url}`);
          console.log(`Album: ${songs[i].album.name}`);
          console.log("-------------------------------------------");
      }
    }
  });
}

function getTweets(){
  var Twitter = require("twitter"); 
  var client = new Twitter(keys.twitter);
    
  var params = {screen_name: "AwlUnh"};
  client.get("statuses/home_timeline", params, function(error, tweets, response) {
    if (!error) {
      console.log("Here are the tweets:");
      for(i =0; i < tweets.length; i++){
        console.log(`Tweeted: "${tweets[i].text}" on ${tweets[i].created_at}`);
      }
    } else {console.log(`Error is: ${error}`)}
  });
}

function userPicks(value1, value2) {
  switch (value1) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song': 
      if(!value2){value2 = "The Sign"};
      getSpotify(value2);  
      break;
    case 'movie-this' :
      if(!value2){value2 = "Mr Nobody"};
      getMovie(value2);
      break; 
    case 'do-what-it-says':
      logData(); 
      break;
    default:
      console.log('liri does not know that');  
  }
}

function getMovie(movieName) {
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  
  request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {

      var foundIt = "";
      var tomsRate = JSON.parse(body).Ratings;
      for (i = 0; i < tomsRate.length; i++){
        switch(tomsRate[i].Source){
          case "Rotten Tomatoes":
          foundIt = tomsRate[i].Value;
          break;
          default: foundIt = "isn't working right"
        }
      }

      console.log("Rotten Tomatoes Rating: " + foundIt);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Cast: " + JSON.parse(body).Actors);
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("    ~Bob Helm");

    } else {console.log("Threw a GD error: " + error)}
  });
}

userPicks(process.argv[2], process.argv[3]);

