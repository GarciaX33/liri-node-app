// will read and set any environment variables with dotenv
require("dotenv").config();
// will initialize the variables
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");
var logTxt = "log.txt";
var randomTxt = "random.txt";

// will access key info
var spotify = new Spotify(keys.spotify);
// will use process.argv to retreive input from user
var command = process.argv[2];
var queryArg = filterData();
function filterData() {
    if (command !== "spotify-this-song") {
        return process.argv.slice(3).join("+");
    } else {
        return process.argv.slice(3).join(" ");
    }
}


// will process user input and decide which function will be executed upon certain command
function inputCommand(input = command) {
    if (input === "concert-this") {
        searchBandsInTown();
    } else if (input === "spotify-this-song") {
        searchSpotify();
    } else if (input === "movie-this") {
        searchOmdb();
    } else if (input === "do-what-it-says") {
        logTextFIle();
        // else it will not recognize commands and return invalid command
    } else {
        console.log("Invalid selection");
        fs.appendFileSync(logTxt, "Invalid selction\n");
    }
}
// BandsinTown will display to console the response data after argument input
function searchBandsInTown() {
    // if no(!) argument inputted default band is Twenty One Pilotss
    if (!queryArg) {
        queryArg = "Twenty One Pilots";
    }
    var queryURL =
        "https://rest.bandsintown.com/artists/" + queryArg + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function (res) {
            if (res) {
                var event = res.data[0];
                console.log("Venue:    " + event.venue.name);
                console.log("Location: " + event.venue.city + ", " + event.venue.region);
                console.log("Date:     " + moment(event.datetime).format("LLL"));
                fs.appendFileSync(logTxt, "Venue:    " + event.venue.name + "\n");
                fs.appendFileSync(logTxt, "Location: " + event.venue.city + ", " + event.venue.region + "\n");
                fs.appendFileSync(logTxt, "Date:     " + moment(event.datetime).format("LLL") + "\n");

            }
        })
        // will catch error if error occurs
        .catch(function (error) {
            console.log(error);
            fs.appendFileSync(logTxt, err + "\n");
        });
}
// Spotify will use the sign ace of base if no song is provided by default
function searchSpotify() {
    if (!queryArg) {
        queryArg = "The Sign Ace of Base";
    }
    // will search for argument input in spotify
    spotify
        .search({
            type: "track",
            query: queryArg,
            limit: 1
        })
        // will then return the response
        .then(function (res) {
            track = res.tracks.items[0];
            console.log("Artist:  " + track.album.artists[0].name);
            console.log("Track:   " + track.name);
            fs.appendFileSync(logTxt, "Artist:  " + track.album.artists[0].name + "\n");
            fs.appendFileSync(logTxt, "Track:   " + track.name + "\n");
            if (track.preview_url) {
                console.log("Preview: " + track.preview_url);
                fs.appendFileSync(logTxt, ("Preview: " + track.preview_url + "\n"));
            }
            console.log("Album:   " + track.album.name);
            fs.appendFileSync(logTxt, ("Album:   " + track.album.name + "\n"));
        })
        .catch(function (err) {
            console.log(err);
            fs.appendFileSync(logTxt, err + "\n");
        });

}
// omdb
function searchOmdb() {
    if (!queryArg) {
        queryArg = "Mr Nobody";
    }
    var queryURL = "http://www.omdbapi.com/?t=" + queryArg + "&y=&apikey=trilogy";
    axios.get(queryURL).then(
        function (res) {
            if (res) {
                console.log("Title:           " + res.data.Title);
                console.log("Year:            " + res.data.Year);
                console.log("IMDb:            " + res.data.imdbRating);
                console.log("Rotten Tomatoes: " + res.data.Ratings[1]);
                console.log("Country:         " + res.data.Country);
                console.log("Language:        " + res.data.Language);
                console.log("Plot:            " + res.data.Plot);
                console.log("Actors:          " + res.data.Actors);
                fs.appendFileSync(logTxt, "Title:           " + res.data.Title + "\n");
                fs.appendFileSync(logTxt, "Year:            " + res.data.Year + "\n");
                fs.appendFileSync(logTxt, "IMDb:            " + res.data.imdbRating + "\n");
                fs.appendFileSync(logTxt, "Rotten Tomatoes: " + res.data.Ratings[1] + "\n");
                fs.appendFileSync(logTxt, "Country:         " + res.data.Country + "\n");
                fs.appendFileSync(logTxt, "Language:        " + res.data.Language + "\n");
                fs.appendFileSync(logTxt, "Plot:            " + res.data.Plot + "\n");
                fs.appendFileSync(logTxt, "Actors:          " + res.data.Actors + "\n");
            }
        })
        .catch(function (error) {
            console.log(error);
            fs.appendFileSync(logTxt, error + "\n");
        });
}

//Using the `fs` Node package, LIRI will take the text inside of random.txt(randomTxt)
function logTextFIle() {
    fs.readFile(randomTxt, "utf-8", function (err, data) {
        if (err) throw err;
        data = data.split(",");
        command = data[0];
        queryArg = data[1];
        inputCommand(command);
    });
}
// will add to log txt after every command and argument
function addToLog() {
    fs.appendFileSync(logTxt, command + "," + queryArg + "\n");
}

fs.appendFileSync(logTxt, "\n-----------------------------------------\n\n");
inputCommand();