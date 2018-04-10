// All of the require statements for the different APIs
require("dotenv").config();
var keys = require ('./keys');
var fs = require("fs");
var Spotify = require ('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

// Get the first process argument and determine which call it is
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

// Function to list 20 tweets
function myTweets() {

    var client = new Twitter(keys.twitter); 
    var params = {screen_name: '@karen_brant3', count: 20};
    
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (!error) {
        console.log("no error");
            
            console.log("\nMY TWEETS");
            console.log("___________\n")
            for (var i = 0; i < tweets.length; i++) {
                console.log ("Tweet " + [i+1] + ": " + tweets[i].text);
                console.log ("Created at: " + tweets[i].created_at + "\n");
            }
        
        } else {
            console.log(error);
        }
    });
}
    
// Function to get a song name and then call the spotifySearch function
function spotifyThis() {
    var songName;

    // Tried to get apostrophes to work, but replace didn't help
    if (process.argv[3]) {
        songName = process.argv[3].replace("'", "\'");
       
        var i=4;
        while (process.argv[i]) {
            songName = songName.concat(" " + process.argv[i].replace("'", "\'"));
            i++;
        }
        
        console.log(songName);
        spotifySearch(songName);

    // If no song is entered, then this will pull "The Sign"
    } else {
        var spotify = new Spotify(keys.spotify);
        spotify.search({type: 'track', query: 'the%20sign'}, function (err, data) {
            if (err) {
                return console.log ('Error occurred: ' + err);
            }

            var tracks = data.tracks.items
            
            for (var i = 0; i < tracks.length; i++) {
                if(tracks[i].artists[0].name === 'Ace of Base' && tracks[i].name === 'The Sign') {
                    console.log("\nSONG INFORMATION");
                    console.log("___________________\n")
                    console.log ("Artist: " + tracks[i].artists[0].name);
                    console.log ("Song name: " + tracks[i].name);
                    console.log ("URL preview: " + tracks[i].preview_url);
                    console.log ("Album: " + tracks[i].album.name);
                    console.log ("\n" + "___________________" + "\n");
                }
            }
        });
    }
}    

// Function to list some information about a particular song
function spotifySearch(song) { 

    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: song, limit: 5}, function (err, data) {
        if (err) {
            return console.log ('Error occurred: ' + err);
        }

        var tracks = data.tracks.items
        
        console.log("\nSONG INFORMATION");
        console.log("___________________\n")
        for (var i = 0; i < tracks.length; i++) {
            console.log ("Artist: " + tracks[i].artists[0].name);
            console.log ("Song name: " + tracks[i].name);
            console.log ("URL preview: " + tracks[i].preview_url);
            console.log ("Album: " + tracks[i].album.name);
            console.log ("\n" + "___________________" + "\n");
        }
    });
}

// Function to list some information about a particular movie
function movieThis() {
    var movieName;

    if (process.argv[3]) {
        movieName = process.argv[3];

        var i=4;
        while (process.argv[i]) {
            movieName = movieName.concat(" " + process.argv[i]);
            console.log(movieName);
            i++;
        }
    } else {
        movieName = 'Mr. Nobody';
    }
    
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("\nMOVIE INFORMATION");
            console.log("___________________\n")
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

// Function to read the random.txt file and do what it says to do
function doWhat() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        
        var result = data.split(",");
        switch(result[0]) {
            case "my-tweets":
            myTweets();
            break;
            
            case "spotify-this-song":
            songName = result[1];
            console.log(songName);
            spotifySearch(songName);
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
    