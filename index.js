const _ = require('underscore');
const fs = require('fs');
const Jimp = require('jimp');
const SpotifyWebApi = require('spotify-web-api-node');
const core = require('@actions/core');

module.exports.playlist = (event, context, callback) => {
  module.exports
    .learnPlaylistName()
    .then(listName => module.exports.listPlaylists(listName))
    .then(playlistID => module.exports.getPlaylist(playlistID))
    .then(module.exports.formatTracks)
    // create new post
    .then(data => module.exports.createPost(data))
    // save tracks to playlists.yml
    .then(data => module.exports.updateMaster(data))
    // save image to img/staging/
    .then(data => module.exports.saveImage(data))
    .then(data => callback(null, data))
    .catch(err => callback(err));
};

module.exports.getPlaylist = playlistID => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret
  });

  return spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .then(() => spotifyApi.getPlaylist(process.env.SpotifyUser, playlistID))
    .then(data => data.body)
    .catch(err => err);
};

module.exports.learnPlaylistName = () => {
  return new Promise(resolve => {
    const today = new Date();
    const month = process.env.MONTH || today.getMonth();
    const year = today.getFullYear();
    const season = {
      2: 'Winter',
      5: 'Spring',
      8: 'Summer',
      11: 'Fall'
    };
    const name = `${month == 2 ? `${year}/${year + 1}` : year} ${
      season[month]
    }`;
    core.exportVariable('playlist', name);
    resolve(name);
  });
};

module.exports.listPlaylists = listName => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret
  });

  return spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .then(() => spotifyApi.getUserPlaylists(process.env.SpotifyUser))
    .then(data => data.body.items.filter(list => list.name === listName)[0].id)
    .catch(err => err);
};

module.exports.formatTracks = data => {
  return new Promise(resolve => {
    resolve({
      name: data.name,
      formatted_name: data.name
        .replace('/', '-')
        .toLowerCase()
        .replace(' ', '-'),
      url:
        data.external_urls && data.external_urls.spotify
          ? data.external_urls.spotify
          : '',
      tracks: module.exports.getTracks(data.tracks),
      image: _.findWhere(data.images, { width: 640 }).url
    });
  });
};

module.exports.getTracks = tracks => {
  return tracks.items.reduce((arr, item) => {
    arr.push({
      name: item.track.name,
      artist: _.pluck(item.track.artists, 'name').join(', '),
      album: item.track.album.name
    });
    return arr;
  }, []);
};

module.exports.createPost = data => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `playlists/_posts/${new Date().toISOString().slice(0, 10)}-${
        data.formatted_name
      }.md`,
      module.exports.buildPost(data),
      err => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
};

module.exports.buildPost = data => {
  let contents = `---\ntitle: ${data.name}\nspotify: ${data.url}\nimage: ${data.formatted_name}.png\npermalink: /playlists/${data.formatted_name}/\n---\n\n[Listen on Spotify](${data.url})\n\n`;
  data.tracks.map(track => {
    contents += `* ${track.name}, ${track.artist}\n`;
  });
  return contents;
};

module.exports.updateMaster = data => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      '_data/playlists.yml',
      module.exports.buildNewMaster(data),
      err => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
};

module.exports.buildNewMaster = data => {
  let content = fs.readFileSync('_data/playlists.yml').toString('utf8');
  content += `- playlist: ${data.name}\n  spotify: ${data.url}\n  tracks:\n`;
  data.tracks.map(track => {
    content += `  - track: ${JSON.stringify(
      track.name
    )}\n    artist: ${JSON.stringify(
      track.artist
    )}\n    album: ${JSON.stringify(track.album)}\n`;
  });
  return content;
};

module.exports.saveImage = data => {
  return new Promise((resolve, reject) => {
    Jimp.read(data.image, (err, img) => {
      if (err) return reject(err);
      img.rgba(false).write(`img/staging/${data.formatted_name}.png`);
      resolve('done!');
    });
  });
};
