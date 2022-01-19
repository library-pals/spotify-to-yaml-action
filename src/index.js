const {
  formatTracks,
  saveImage,
  updateMain,
} = require("spotify-to-jekyll/index.js");
const core = require("@actions/core");
const learnPlaylistName = require("./learn-playlist-name");
const listPlaylists = require("./list-playlists");

async function action() {
  try {
    const playlistName = learnPlaylistName();
    listPlaylists(playlistName)
      .then(formatTracks)
      // save tracks to playlists.yml
      .then((data) => updateMain(data))
      // save image to img/staging/
      .then((data) => saveImage(data))
      .catch((err) => core.setFailed(err.message));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = action();
