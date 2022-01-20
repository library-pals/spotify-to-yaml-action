import formatTracks from "spotify-to-jekyll/src/format-tracks.js";
import updateMain from "spotify-to-jekyll/src/update-main.js";
import saveImage from "spotify-to-jekyll/src/save-image.js";
import { setFailed } from "@actions/core";
import learnPlaylistName from "./learn-playlist-name";
import listPlaylists, { Playlist } from "./list-playlists";

type FormatedPlaylist = {
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
    const formatPlaylist = (await formatTracks(playlist)) as FormatedPlaylist;
    // save tracks to playlists.yml
    await updateMain(formatPlaylist);
    // save image to img/staging/
    await saveImage(formatPlaylist);
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
