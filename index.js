const {
  getPlaylist,
  formatTracks,
  createPost,
  saveImage,
  updateMaster,
} = require("spotify-to-jekyll");
const core = require("@actions/core");
const SpotifyWebApi = require("spotify-web-api-node");

module.exports.playlist = (event, context, callback) => {
  module.exports
    .learnPlaylistName()
    .then((listName) => module.exports.listPlaylists(listName))
    .then((playlistID) => getPlaylist(playlistID))
    .then(formatTracks)
    // create new post
    .then((data) => createPost(data))
    // save tracks to playlists.yml
    .then((data) => updateMaster(data))
    // save image to img/staging/
    .then((data) => saveImage(data))
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
};

module.exports.learnPlaylistName = () => {
  return new Promise((resolve) => {
    const today = new Date();
    const month = process.env.MONTH || today.getMonth();
    const year = process.env.YEAR || today.getFullYear();
    const season = {
      2: "Winter",
      5: "Spring",
      8: "Summer",
      11: "Fall",
    };
    const name = `${month == 2 ? `${year}/${year + 1}` : year} ${
      season[month]
    }`;
    core.exportVariable("playlist", name);
    resolve(name);
  });
};

module.exports.listPlaylists = (listName) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret,
  });

  return spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .then(() => spotifyApi.getUserPlaylists(process.env.SpotifyUser))
    .then(
      (data) => data.body.items.filter((list) => list.name === listName)[0].id
    )
    .catch((err) => err);
};
