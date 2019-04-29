// define global letiables
require("dotenv").config();
let keys = require("./keys");
//let inquirer = require("inquirer");
let Spotify = require("node-spotify-api");
let moment = require('moment')
let axios = require('axios');
let fs = require('fs');

let spotify = new Spotify(keys.spotify);

let song = '';
let artist = '';
let movie = '';

let command = process.argv;
//Take what the user types in and run the appropriate function
if (command[2] === 'concert-this') {
    getConcert();
} else if (command[2] === 'spotify-this-song') {
    getSong();
} else if (command[2] === 'movie-this') {
    getMovie();
} else if (command[2] === 'do-what-it-says') {
    //Read the random.txt file
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            //split the random.txt by the comma an dput it in an array
            let dataArr = data.split(',');
            //run the appropriate funciton based on the command in the random.txt file
            if (dataArr[0] === 'concert-this') {
                artist = dataArr[1];
                getConcert();
            } else if (dataArr[0] === 'spotify-this-song') {
                song = dataArr[1];
                getSong();
            } else if (dataArr[0] === 'movie-this') {
                movie = dataArr[1];
                getMovie();
            }
        }

    });
}

function getSong() {
    //if the song is more than 1 word, add '+' signs inbetween words
    for (var i = 3; i < command.length; i++) {
        if (i > 3 && i < command.length) {
            song = song + "+" + command[i];
        } else {
            song += command[i];
        }
    }
    //if song exists, run the spotify npm package to pull the song and console log the info
    //if song does not exsist, pull the song info for 'The Sign of Base'
    if (song !== '') {
        spotify.search({
            type: 'track',
            query: song,
            limit: 1
        }).then(function (response) {
            let songObj = response.tracks.items[0];
            let artistName = songObj.album.artists[0].name;
            let displaySong = songObj.name;
            console.log(`
            Artist: ${artistName}
            Song title: ${displaySong}
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}
            `);

            fs.appendFile('log.txt', `
            Artist: ${artistName}
            Song title: ${displaySong}
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}

            `, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to log.txt!');
            });

        }).catch(err => {
            console.log(err);
        });

    } else {
        spotify.search({
            type: 'track',
            query: 'The Sign Ace of Base',
            limit: 1
        }).then(function (response) {
            let songObj = response.tracks.items[0];
            let artistName = songObj.album.artists[0].name;
            console.log(`
            Artist: ${artistName}
            Song title: 'The Sign'
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}
            `);

            fs.appendFile('log.txt', `
            Artist: ${artistName}
            Song title: 'The Sign'
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}

            `, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to log.txt!');
            });
        });
    }
}
//if the artist is more than 1 word, add '+' signs inbetween words
function getConcert() {
    for (var i = 3; i < command.length; i++) {
        if (i > 3 && i < command.length) {
            artist = artist + "+" + command[i];
        } else {
            artist += command[i];
        }
    }
    //if artist exists, run axios function to pull the artist and console log the info
    //if song does not exsist, console log a message that the artist doesn't exist
    if (artist !== '') {
        axios({
            method: 'get',
            //Change API key below
            url: `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`,
            responseType: 'json'
        }).then(function (response) {
            let showArr = response.data;
            for (let i = 0; i < showArr.length; i++) {
                let orgShowDate = showArr[i].datetime;
                let showDate = moment(orgShowDate).format('L');

                console.log(`
                Lineup: ${showArr[i].lineup}
                Venue Name: ${showArr[i].venue.name}
                Venue Location: ${showArr[i].venue.city}, ${showArr[i].venue.country}
                Show Date: ${showDate}
                `);

                fs.appendFile('log.txt', `
                Lineup: ${showArr[i].lineup}
                Venue Name: ${showArr[i].venue.name}
                Venue Location: ${showArr[i].venue.city}, ${showArr[i].venue.country}
                Show Date: ${showDate}
                `, (err) => {
                    if (err) throw err;
                });
            }
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log("The artist name is not defined. Please try a different artist");
    }
}
//if movie exists, run axios function to pull the artist and console log the info
//if song does not exsist, pull information for the movie 'Mr. Nobody'
//uses IMDB API
function getMovie() {
    for (var i = 3; i < command.length; i++) {
        if (i > 3 && i < command.length) {
            movie = movie + "+" + command[i];
        } else {
            movie += command[i];
        }
    }
    if (movie !== '') {
        axios({
            method: 'get',
            //Change API key below
            url: `http://www.omdbapi.com/?apikey=c3f10979&t=${movie}`,
            responseType: 'json'
        }).then(function (response) {
            //console.log(response.data);
            let dateObj = new Date(response.data.Released);
            let releaseDate = dateObj.toISOString();
            let releaseYear = moment(releaseDate).format('YYYY');
            console.log(`
            Title: ${response.data.Title}
            Year Released: ${releaseYear}
            IMDB Rating: ${response.data.Ratings[0].Value}
            RottenTomatoes Rating: ${response.data.Ratings[1].Value}
            Country: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
            `);

            fs.appendFile('log.txt', `
            Title: ${response.data.Title}
            Year Released: ${releaseYear}
            IMDB Rating: ${response.data.Ratings[0].Value}
            RottenTomatoes Rating: ${response.data.Ratings[1].Value}
            Country: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
                `, (err) => {
                if (err) throw err;
            });

        }).catch(err => {
            console.log(err);
        });
    } else {
        let movie = 'Mr. Nobody';
        axios({
            method: 'get',
            url: `http://www.omdbapi.com/?apikey=c3f10979&t=${movie}`,
            responseType: 'json'
        }).then(function (response) {
            //console.log(response.data);
            let dateObj = new Date(response.data.Released);
            let releaseDate = dateObj.toISOString();
            let releaseYear = moment(releaseDate).format('YYYY');
            console.log(`
            Title: ${response.data.Title}
            Released: ${releaseYear}
            IMDB Rating: ${response.data.Ratings[0].Value}
            RottenTomatoes Rating: ${response.data.Ratings[1].Value}
            Country: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
            `);

            fs.appendFile('log.txt', `
            Title: ${response.data.Title}
            Year Released: ${releaseYear}
            IMDB Rating: ${response.data.Ratings[0].Value}
            RottenTomatoes Rating: ${response.data.Ratings[1].Value}
            Country: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
                `, (err) => {
                if (err) throw err;
            });

        }).catch(err => {
            console.log(err);
        });
    }

}







//------------------------------ Ability to incorporate Inquirier to this project----------------------//////
// function getSong() {
//     inquirer.prompt([{
//         type: "input",
//         message: "Which song whould you like me to look up?",
//         name: "query"
//     }]).then(function (inquirerResponse) {
//         if (inquirerResponse.query !== '') {
//             spotify.search({
//                 type: 'track',
//                 query: inquirerResponse.query,
//                 limit: 1
//             }).then(function (response) {
//                 //console.log(response);
//                 let songObj = response.tracks.items[0];
//                 let artistName = songObj.album.artists[0].name;
//                 //console.log(songObj);
//                 console.log(`
//                             Artist: ${artistName}
//                             Song title: ${inquirerResponse.query}
//                             Album Name: ${songObj.album.name}
//                             Preview URL: ${songObj.preview_url}
//                             `);
//             });
//         } else {
//             spotify.search({
//                 type: 'track',
//                 query: 'The Sign Ace of Base',
//                 limit: 1
//             }).then(function (response) {
//                 //console.log(response);
//                 let songObj = response.tracks.items[0];
//                 let artistName = songObj.album.artists[0].name;
//                 //console.log(songObj);
//                 console.log(`
//                             Artist: ${artistName}
//                             Song title: 'The Sign'
//                             Album Name: ${songObj.album.name}
//                             Preview URL: ${songObj.preview_url}
//                             `);
//             });
//         }
//     });
// };


// function getConcert() {
//     inquirer.prompt([{
//         type: "input",
//         message: "What artist do you want to search?",
//         name: "query"
//     }]).then(function (inquirerResponse) {
//         let artist = inquirerResponse.query;
//         axios({
//             method: 'get',
//             url: `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`,
//             responseType: 'json'
//         }).then(function (response) {
//             let showArr = response.data;
//             for (let i = 0; i < showArr.length; i++) {
//                 // let venueName = showArr[i].venue.name;
//                 // let venueCity = showArr[i].venue.city;
//                 // let venueCountry = showArr[i].venue.country;
//                 let orgShowDate = showArr[i].datetime;
//                 let showDate = moment(orgShowDate).format('L');

//                 console.log(`
//                         Venue Name: ${showArr[i].venue.name}
//                         Venue Location: ${showArr[i].venue.city}, ${showArr[i].venue.country}
//                         Show Date: Venue Location: ${showDate}
//                         `);
//             };
//         }).catch(function (err) {
//             console.log("The artists name is not defined. Please try a different artist");
//         });
//     });
// }

// function getMovie() {
//     inquirer.prompt([{
//         type: "input",
//         message: "Which movie whould you like me to look up?",
//         name: "query"
//     }]).then(function (inquirerResponse) {
//         if (inquirerResponse.query !== '') {
//             let movie = inquirerResponse.query;
//             axios({
//                 method: 'get',
//                 url: `http://www.omdbapi.com/?apikey=c3f10979&t=${movie}`,
//                 responseType: 'json'
//             }).then(function (response) {
//                 console.log(response.data);
//                 let releaseDate = response.data.Released;
//                 let releaseYear = moment(releaseDate).format('YYYY');
//                 console.log(`
//                 Title: ${response.data.Title}
//                 Year Released: ${releaseYear}
//                 IMDB Rating: ${response.data.Ratings[0].Value}
//                 RottenTomatoes Rating: ${response.data.Ratings[1].Value}
//                 Country: ${response.data.Country}
//                 Language: ${response.data.Language}
//                 Plot: ${response.data.Plot}
//                 Actors: ${response.data.Actors}
//                 `)
//             });
//         } else {
//             let movie = 'Mr. Nobody';
//             axios({
//                 method: 'get',
//                 url: `http://www.omdbapi.com/?apikey=c3f10979&t=${movie}`,
//                 responseType: 'json'
//             }).then(function (response) {
//                 console.log(response.data);
//                 let releaseDate = response.data.Released;
//                 let releaseYear = moment(releaseDate).format('YYYY');
//                 console.log(`
//                 Title: ${response.data.Title}
//                 Released: ${releaseYear}
//                 IMDB Rating: ${response.data.Ratings[0].Value}
//                 RottenTomatoes Rating: ${response.data.Ratings[1].Value}
//                 Country: ${response.data.Country}
//                 Language: ${response.data.Language}
//                 Plot: ${response.data.Plot}
//                 Actors: ${response.data.Actors}
//                 `)
//             });
//         }
//     });
// };