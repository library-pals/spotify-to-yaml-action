#!/usr/bin/env node

"use strict";

const meow = require("meow");
const script = require("./index.js");

const cli = meow(`
	Usage
	  $ spotify-to-jekyll <playlist_id>

	Examples
	  $ spotify-to-jekyll 0000111100001111
`);

if (!cli.input.length) {
  console.log(cli.help);
  return;
}

process.env.SpotifyPlaylist = cli.input;

script.playlist({}, null, (err, callback) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(callback);
});
