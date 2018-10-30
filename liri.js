require("dotenv").config();

var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var dotenv = require("dotenv");
var keys = require("./keys");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var nodeArgs = process.argv;

// Create an empty variable for holding the movie name
var bands = "";
var movies = "";
var songs = "";
var args = "";
for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    movies = movies + " " + nodeArgs[i];
    bands = bands + "%20" + nodeArgs[i];
    songs = songs + " " + nodeArgs[i];
    args = args + " " + nodeArgs[i];
  }

  else {

    movies += nodeArgs[i];
    bands += nodeArgs[i];
    songs += nodeArgs[i];
    args += nodeArgs[i];

  }
}

var queryBand = "https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp";
var queryMovie = "http://www.omdbapi.com/?t=" + movies + "&y=&plot=short&apikey=trilogy";


if (process.argv[2] === "concert-this") {
  request(queryBand, function (error, response, body) {


    if (!error && response.statusCode === 200) {
      var bandData = JSON.parse(body)
      //console log band and event information
      console.log("\n" + queryBand);
      console.log("\n" + args);
      console.log("\nVenue: " + bandData[0].venue.name)
      console.log("\nVenue Location: " + bandData[0].venue.city + " " + bandData[0].venue.country)
      console.log("\nDate of Event: " + moment(bandData[0].datetime).format("MM/DD/YYYY"))
     
    }
  });
}


if (process.argv[2] === "movie-this") {
  request(queryMovie, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("\n" + queryMovie);
      // console.log("\n" + movies);
      console.log("\nMovie Titile: " + JSON.parse(body).Title);
      console.log("\nRelease Year: " + JSON.parse(body).Year);
      console.log("\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("\nCountry of Origin: " + JSON.parse(body).Country);
      console.log("\nLanguage: " + JSON.parse(body).Language);
      console.log("\nPlot: " + JSON.parse(body).Plot);
      console.log("\nActors: " + JSON.parse(body).Actors);
    }
  });
}

if (process.argv[2] === "spotify-this-song") {

  spotify
    .request('https://api.spotify.com/v1/search?q=' + songs + '&type=track')
    .then(function (data) {
      console.log(data);
      // console.log(data.artists);
      // console.log(data.track);
      // console.log(data.url);
      // console.log(data.album);
    })
    .catch(function (err) {
      console.error('Error occurred: ' + err);
    });

}

if (process.argv[2] === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr);

    spotify.search({ type: "track", query: dataArr[1] }, function (err, body) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      console.log(body);
    });

  });
}
