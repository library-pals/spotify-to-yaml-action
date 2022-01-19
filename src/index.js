import {
  formatTracks,
  saveImage,
  updateMain,
} from "spotify-to-jekyll/index.js";
import { setFailed, info } from "@actions/core";
import learnPlaylistName from "./learn-playlist-name";
import listPlaylists from "./list-playlists";

export async function action() {
  try {
    const playlistName = learnPlaylistName();
    const playlist = await listPlaylists(playlistName);
    info(playlist);
    const formatPlaylist = await formatTracks(playlist);
    // save tracks to playlists.yml
    await updateMain(formatPlaylist);
    // save image to img/staging/
    await saveImage(formatPlaylist);
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
