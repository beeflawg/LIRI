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
var args = "";

for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    args = args + "+" + nodeArgs[i];

  }

  else {

    args += nodeArgs[i];

  }
}

var queryBand = "https://rest.bandsintown.com/artists/" + args + "/events?app_id=codingbootcamp";
var queryMovie = "http://www.omdbapi.com/?t=" + args + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(queryBand);
console.log(queryMovie);
console.log(args);

if (process.argv[2] === "concert-this") {
  request(queryBand, function (error, response, body) {


    if (!error && response.statusCode === 200) {


      // console.log("Venue: " + body.venue.name)
      // console.log("Venue Location: " + body.venue.city + " " + body.venue.country)
      console.log("Date of Event: " + body.venue)
      // console.log(body);
    }
  });
}


if (process.argv[2] === "movie-this") {
  request(queryMovie, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("Movie Titile: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country of Origin: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

if (process.argv[2] === "spotify-this-song") {
  // spotify.search({ type: "track", query: args }, function(err, data) {
  // if (err) {
  //   return console.log('Error occurred: ' + err);
  // }

  spotify
    .request('https://api.spotify.com/v1/search?q=' + args + '&type=track')
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
  //


  // });
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
