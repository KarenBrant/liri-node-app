
require("dotenv").config();
// var config = require ('./config');

var keys = require ('./keys');
// console.log(keys);
var fs = require("fs");
var Spotify = require ('node-spotify-api');
var Twitter = require('twitter');
// var Twitter = new twit(config);

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

    var client = new Twitter(keys.twitter); 
    var params = {screen_name: '@karen_brant3', count: 10};
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (!error) {
        console.log("no error");
        
        for (var i = 0; i < tweets.length; i++) {
            console.log ("Tweet" + [i+1] + ": " + tweets[i].text);
        }
        
        } else {
            console.log(error);
        }
    });
}
    
function spotifyThis() {
    var songName;
    
    var spotify = new Spotify(keys.spotify);
    if (process.argv[3]) {
        songName = process.argv[3];
    } else {
        songName = 'The Sign';
    }
    
    spotify.search({ type: 'track', query: songName, limit: 5}, function (err, data) {
        if (err) {
            return console.log ('Error occurred: ' + err);
        }

        var tracks = data.tracks.items;
        // console.log (tracks);
    
        for (var i = 0; i < tracks.length; i++) {
            console.log ("Artist: " + JSON.stringify(tracks[i].artists));
            console.log ("Song name: " + tracks[i].name);
            console.log ("URL preview: " + tracks[i].preview_url);
            console.log ("Album: " + tracks[i].album.name);
            console.log ("\n" + "___________________" + "\n");
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
        
        console.log (data);
        var result = data.split(",");
        console.log (result[0]);
        
        switch(result[0]) {
            case "my-tweets":
            myTweets();
            break;
            
            case "spotify-this-song":
            songName = result[1];
            console.log(songName);
            spotifyThis2(songName);
            break;
            
            case "movie-this":
            movieThis();
            break;
        
            case "do-what-it-says":
            doWhat();
            break;
        }
    });
    };
    

function spotifyThis2(song) {
    // var spotify = new Spotify ({
    //     id: process.env.SPOTIFY_ID,
    //     secret: process.env.SPOTIFY_SECRET
    // });
    
    var spotify = new Spotify(keys.spotify);
    
    
    spotify.search({ type: 'track', query: song, limit: 5}, function (err, data) {
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
            console.log ("/n ___________________/n");
        }
    });
}