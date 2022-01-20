import updateMain from "spotify-to-jekyll/src/update-main.js";
import { setFailed, exportVariable } from "@actions/core";
import learnPlaylistName from "./learn-playlist-name";
import listPlaylists from "./list-playlists";

export type Playlist = {
  name: string;
  formatted_name: string;
  url: string;
  tracks: {
    name: string;
    artist: string;
    album: string;
  }[];
  image: string;
};

export async function action() {
  try {
    const playlistName: string = learnPlaylistName();
    const playlist = (await listPlaylists(playlistName)) as Playlist;
    // export image variable to be downloaded latter
    if (playlist.image) {
      exportVariable(
        "PlaylistImageOutput",
        `playlist-${playlist.formatted_name}.png`
      );
      exportVariable("PlaylistImage", playlist.image);
      // replace Spotify image url with local version
      playlist.image = `playlist-${playlist.formatted_name}.png`;
    }
    // save tracks to playlists.yml
    await updateMain(playlist);
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
