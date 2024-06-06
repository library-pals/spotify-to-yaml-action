import { getInput } from "@actions/core";
import SpotifyWebApi from "spotify-web-api-node";
import { Playlist } from "./index.js";

export default async function listPlaylists(
  listName: string
): Promise<Playlist> {
  try {
    const spotifyApi = await initializeSpotifyApi();
    const username = getInput("spotify-username");

    const findPlaylist = await getPlaylist(spotifyApi, username, listName);
    const items = await getPlaylistTracks(spotifyApi, findPlaylist.id);

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

async function getPlaylist(
  spotifyApi: SpotifyWebApi,
  username: string,
  listName: string
): Promise<SpotifyApi.PlaylistObjectSimplified> {
  const { body } = await spotifyApi.getUserPlaylists(username);
  const findPlaylist = body.items.find(({ name }) => name === listName);

  if (!findPlaylist) {
    throw new Error(`Could not find playlist "${listName}". Is it private?`);
  }

  return findPlaylist;
}

async function getPlaylistTracks(
  spotifyApi: SpotifyWebApi,
  playlistId: string
): Promise<SpotifyApi.PlaylistTrackObject[]> {
  const {
    body: { items },
  } = await spotifyApi.getPlaylistTracks(playlistId);

  if (!items.length) throw new Error("Playlist has no tracks.");

  return items;
}

export async function initializeSpotifyApi(): Promise<SpotifyWebApi> {
  const clientId = process.env.SpotifyClientID;
  const clientSecret = process.env.SpotifyClientSecret;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SpotifyClientID or SpotifyClientSecret in environment variables"
    );
  }

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
  });

  const {
    body: { access_token },
  } = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(access_token);

  return spotifyApi;
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

export function formatName(name: string): string {
  return name
    .replace(/\s/g, "-")
    .replace(/[/]/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}
