import { setFailed, getInput } from "@actions/core";
import SpotifyWebApi from "spotify-web-api-node";
import formatTracks from "spotify-to-jekyll/src/format-tracks.js";
import { Playlist } from "./index.js";

export default async function listPlaylists(
  listName: string
): Promise<Playlist | undefined> {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyClientID,
    clientSecret: process.env.SpotifyClientSecret,
  });
  const username = getInput("spotifyUser");
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
  return formatTracks({
    name: findPlaylist.name,
    external_urls: findPlaylist.external_urls,
    images: findPlaylist.images,
    tracks: {
      items,
    },
  });
}
