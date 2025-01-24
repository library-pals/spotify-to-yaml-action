import updateMain from "./write-file.js";
import { setFailed, exportVariable, getInput } from "@actions/core";
import listPlaylists from "./list-playlists.js";
import * as github from "@actions/github";

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
    const payload = github.context.payload.inputs;
    const playlistName =
      payload?.["playlist-name"] || getInput("playlist-name");

    if (!playlistName) {
      throw new Error("Playlist name is required");
    }

    const playlist = await listPlaylists(playlistName);

    // export image variable to be downloaded later
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
