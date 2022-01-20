import { setFailed, getInput } from "@actions/core";
import SpotifyWebApi from "spotify-web-api-node";
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
  const findPlaylist: SpotifyPlaylist = body.items.find(
    ({ name }) => name === listName
  );
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
    tracks: items,
  });
}

export function formatTracks({
  name,
  external_urls,
  images,
  tracks,
}: {
  name: string;
  external_urls: SpotifyPlaylist["external_urls"];
  images: SpotifyPlaylist["images"];
  tracks: SpotifyTrack[];
}): Playlist {
  const largestImage = images.sort((a, b) => b.width - a.width)[0];
  return {
    name,
    formatted_name: name.replace("/", "-").toLowerCase().replace(" ", "-"),
    url: external_urls.spotify,
    tracks: tracks.map(({ track }) => ({
      name: track.name,
      artist: track.artists.map(({ name }) => name).join(", "),
      album: track.album.name,
    })),
    image: largestImage.url,
  };
}

export type SpotifyTrack = {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: {
    album: {
      album_type: string;
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }
      ];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];

      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: true;
    track_number: number;
    type: string;
    uri: string;
  };
  video_thumbnail: {
    url: string | null;
  };
};

export type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};
