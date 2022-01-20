import { writeFile, readFile } from "fs/promises";
import { Playlist } from ".";
import { load, dump } from "js-yaml";
import { setFailed } from "@actions/core";

export default async function updateMain(data: Playlist, fileName: string) {
  try {
    const newContents = await buildNewMain(data, fileName);
    if (!newContents) {
      setFailed("Unable to add playlist");
      return;
    }
    return await writeFile(fileName, newContents);
  } catch (error) {
    setFailed(error);
  }
}

export async function buildNewMain(data: Playlist, fileName: string) {
  try {
    const currentPlaylists: string | [] =
      (await readFile(fileName, "utf-8")) || "";
    const currentJson = load(currentPlaylists) as Playlist[];
    const newPlaylist = {
      playlist: data.name,
      spotify: data.url,
      tracks: data.tracks.map(({ name, artist, album }) => ({
        track: name,
        artist,
        album,
      })),
    };
    const json = [...(currentPlaylists && [...currentJson]), newPlaylist];
    return dump(json);
  } catch (error) {
    setFailed(error);
  }
}
