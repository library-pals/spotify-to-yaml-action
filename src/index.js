const {
  formatTracks,
  saveImage,
  updateMain,
} = require("spotify-to-jekyll/index.js");
const core = require("@actions/core");
const SpotifyWebApi = require("spotify-web-api-node");

function learnPlaylistName() {
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
    const name = `${month == 2 ? `${year - 1}/${year}` : year} ${
      season[month]
    }`;
    core.exportVariable("playlist", name);
    resolve(name);
  });
}

function listPlaylists(listName) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret,
  });

  return spotifyApi
    .clientCredentialsGrant()
    .then((data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      return spotifyApi
        .getUserPlaylists(process.env.SpotifyUser)
        .then(({ body }) => {
          const findPlaylist = body.items.find(
            (list) => list.name === listName
          );
          if (!findPlaylist) {
            core.setFailed(
              `Could not find playlist "${listName}". Is it private?`
            );
            return;
          }
          return findPlaylist;
        })
        .then(({ name, external_urls, id, images }) => {
          return spotifyApi.getPlaylistTracks(id).then(({ body }) => {
            return {
              name,
              external_urls,
              images,
              tracks: {
                items: body.items,
              },
            };
          });
        })
        .catch((err) => err);
    })
    .catch((err) => err);
}

try {
  learnPlaylistName()
    .then((listName) => listPlaylists(listName))
    .then(formatTracks)
    // save tracks to playlists.yml
    .then((data) => updateMain(data))
    // save image to img/staging/
    .then((data) => saveImage(data))
    .catch((err) => core.setFailed(err.message));
} catch (error) {
  core.setFailed(error.message);
}

module.exports = { learnPlaylistName, listPlaylists };
