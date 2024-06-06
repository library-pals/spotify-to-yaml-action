import updateMain from "./write-file";
import { setFailed, exportVariable, getInput } from "@actions/core";
import learnPlaylistName from "./learn-playlist-name";
import listPlaylists from "./list-playlists";

export type Playlist = {
  name: string;
  formatted_name: string;
  url: string;
  tracks: {
    name?: string;
    artist?: string;
    album?: string;
  }[];
  image: string;
};

export type WorkflowPayload = {
  "playlist-name"?: string;
};

export async function action() {
  try {
    const filename = getInput("filename");
    const playlistName = learnPlaylistName();
    const playlist = await listPlaylists(playlistName);

    // export image variable to be downloaded latter
    exportVariable("playlist", playlistName);
    exportVariable("PlaylistImageOutput", `${playlist.formatted_name}.png`);
    exportVariable("PlaylistImage", playlist.image);
    // replace Spotify image url with local version
    playlist.image = `${playlist.formatted_name}.png`;
    // save tracks to playlists.yml
    await updateMain(playlist, filename);
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
