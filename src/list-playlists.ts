import { getInput } from "@actions/core";
import SpotifyWebApi from "spotify-web-api-node";
import { Playlist } from "./index.js";

export default async function listPlaylists(
  listName: string
): Promise<Playlist> {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SpotifyClientID,
      clientSecret: process.env.SpotifyClientSecret,
    });
    const username = getInput("spotify-username");
    const {
      body: { access_token },
    } = await spotifyApi.clientCredentialsGrant();

    spotifyApi.setAccessToken(access_token);

    const { body } = await spotifyApi.getUserPlaylists(username);
    const findPlaylist = body.items.find(({ name }) => name === listName);
    if (!findPlaylist) {
      throw new Error(`Could not find playlist "${listName}". Is it private?`);
    }
    const {
      body: { items },
    } = await spotifyApi.getPlaylistTracks(findPlaylist.id);
    if (!items.length) throw new Error("Playlist has no tracks.");

    return formatTracks({
      name: findPlaylist.name,
      external_urls: findPlaylist.external_urls,
      images: findPlaylist.images,
      tracks: items,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export function formatTracks({
  name,
  external_urls,
  images,
  tracks,
}: {
  name: string;
  external_urls: SpotifyApi.ExternalUrlObject;
  images: SpotifyApi.ImageObject[];
  tracks: SpotifyApi.PlaylistTrackObject[];
}): Playlist {
  const largestImage = images.sort(
    (a, b) => (b.width || 0) - (a.width || 0)
  )[0];
  return {
    name,
    formatted_name: formatName(name),
    url: external_urls.spotify,
    tracks: tracks.map(({ track }) => ({
      name: track?.name,
      artist: track?.artists.map(({ name }) => name).join(", "),
      album: track?.album.name,
    })),
    image: largestImage.url,
  };
}

function formatName(name: string): string {
  return name
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}
