# liri-node-app

LIRI is a Language Interpretation and Recognition Interface.
Use LIRI to get information about the song or movie of your
choice and it can get an artist's upcoming concert information

## Installs

The [package.json](https://github.com/Meggin/liri-node-app/blob/master/package.json)
lists dependent node packages, but for your convenvice, these are the ones to install.

### Node Spotify API

`npm install --save node-spotify-api`

### Moment

`npm install mement`

### FS

`npm install fs`

### Axios

`npm install axios`

## Get Started

Here's a quick rundom of the commands you can use in LIRI.

### Get Concert Info

This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

     * Name of the venue

     * Venue location

     * Date of the Event (use moment to format this as "MM/DD/YYYY")

**You must replace the Bands in Town API key on line 99**

`node liri.js concert-this`

### Get Song Info

This will show the following information about the song in your terminal/bash window

     * Artist(s)

     * The song's name

     * A preview link of the song from Spotify

     * The album that the song is from

   * If no song is provided then your program will default to "The Sign" by Ace of Base.

   **You must replace the SPOTIFY_ID and SPOTIFY_SECRET in the .env file**

`node liri.js spotify-this-song "All The Small Things"`

### Get Movie Info

This will output the following information to your terminal/bash window:

     ```
       * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
     ```

   * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

   **You must replace the OMDB API key on line 124**

`node liri.js movie-this "Star Wars"`

### Get Command from Random.txt

Gets text inside a the radnom.txt and does what it says:

`node liri.js do-what-it-says`
