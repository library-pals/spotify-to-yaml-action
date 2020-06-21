#!/usr/bin/env node

"use strict";

const meow = require("meow");
const script = require("./index.js");

const cli = meow(
  `
	Usage
	  $ spotify-to-jekyll <playlist_id>

	Options
      --postsDir, -p  Relative path to your _posts folder
			--imgDir, -i  Relative path to your images folder
			--updateDataFile, -d  Update a data file with your playlist data

	Examples
	  $ spotify-to-jekyll 0000111100001111
		$ spotify-to-jekyll 0000111100001111 --postsDir=_posts
`,
  {
    flags: {
      postsDir: {
        type: "string",
        default: "playlists/_posts",
        alias: "p",
      },
      imgDir: {
        type: "string",
        default: "img",
        alias: "i",
      },
      updateDataFile: {
        type: "boolean",
        default: false,
        alias: "d",
      },
    },
  }
);

if (!cli.input.length) {
  console.log(cli.help);
  return;
}

process.env.SpotifyPlaylist = cli.input;
process.env.PostsDir = cli.flags.postsDir;
process.env.ImgDir = cli.flags.imgDir;
process.env.UpdateDataFile = cli.flags.updateDataFile;

script.playlist({}, null, (err, callback) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(callback);
});
