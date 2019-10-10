#!/usr/bin/env node

const script = require('../index.js');
const argv = require('minimist')(process.argv.slice(2));

if (!argv.playlist) {
  console.log('Usage:   spotify-to-jekyll --playlist=<playlist-id>');
  console.log('Example: spotify-to-jekyll --playlist=0000111100001111');
  process.exit(1);
}

process.env.SpotifyPlaylist = argv.playlist;

script.playlist({}, null, (err, callback) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(callback);
});
