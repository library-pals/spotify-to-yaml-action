const {
  formatTracks,
  saveImage,
  updateMain,
} = require("spotify-to-jekyll/index.js");
const { setFailed, info } = require("@actions/core");
const learnPlaylistName = require("./learn-playlist-name");
const listPlaylists = require("./list-playlists");

async function action() {
  try {
    const playlistName = learnPlaylistName();
    const playlist = await listPlaylists(playlistName);
    info(playlist);
    const formatPlaylist = await formatTracks(playlist);
    // save tracks to playlists.yml
    await updateMain(formatPlaylist);
    // save image to img/staging/
    await saveImage(formatPlaylist);
  } catch (error) {
    setFailed(error.message);
  }
}

module.exports = action;
