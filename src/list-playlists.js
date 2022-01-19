import { setFailed } from "@actions/core";
import SpotifyWebApi from "spotify-web-api-node";

export default async function listPlaylists(listName) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret,
  });
  const username = process.env.SpotifyUser;
  const {
    body: { access_token },
  } = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(access_token);

  const { body } = await spotifyApi.getUserPlaylists(username);
  const findPlaylist = body.items.find((list) => list.name === listName);
  if (!findPlaylist) {
    setFailed(`Could not find playlist "${listName}". Is it private?`);
    return;
  }
  const {
    body: { items },
  } = await spotifyApi.getPlaylistTracks(findPlaylist.id);
  return {
    name: findPlaylist.name,
    external_urls: findPlaylist.external_urls,
    images: findPlaylist.images,
    tracks: {
      items,
    },
  };
}
