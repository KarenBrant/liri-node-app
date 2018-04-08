
require("dotenv").config();

var keys = require ('./keys');
// console.log(keys);
var fs = require("fs");
var Spotify = require ('node-spotify-api');
var Twitter = require('twitter');

var request = require("request");
var whichAPI = process.argv[2];
console.log ("whichAPI: " + whichAPI);

switch(whichAPI) {
    case "my-tweets":
    myTweets();
    break;
    
    case "spotify-this-song":
    spotifyThis();
    break;
    
    case "movie-this":
    movieThis();
    break;

    case "do-what-it-says":
    doWhat();
    break;
}

function myTweets() {
    // var client = new Twitter({
    //     consumer_key: process.env.TWITTER_CONSUMER_KEY,
    //     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    //     access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    //     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    //   });
      var client = new Twitter(keys.twitter);  
      var params = {q: '*', count: 20};
      client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            console.log("no error");
          console.log(tweets);
        }
      });
}
    
function spotifyThis() {
    var songName;
    // var spotify = new Spotify ({
    //     id: process.env.SPOTIFY_ID,
    //     secret: process.env.SPOTIFY_SECRET
    // });
    
    var spotify = new Spotify(keys.spotify);
    if (process.argv[3]) {
        songName = process.argv[3];
    } else {
        songName = 'The Sign';
    }
    
    spotify.search({ type: 'track', query: songName, limit: 1}, function (err, data) {
        if (err) {
            return console.log ('Error occurred: ' + err);
        }

        var tracks = data.tracks.items;
        // console.log (tracks);
    
        for (var i = 0; i < tracks.length; i++) {
            console.log ("Artist: " + tracks[i].artist);
            console.log ("Song name: " + tracks[i].name);
            console.log ("URL preview: " + tracks[i].preview_url);
            console.log ("Album: " + tracks[i].album.name);
        }
    });
}


function movieThis() {

    var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where Produced: " + JSON.parse(body).Country);
            console.log("Movie Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors in movie: " + JSON.parse(body).Actors);
        }
    });
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
    });
}