import { writeFile, readFile } from "fs/promises";
import { Playlist } from "./index.js";
import { load, dump } from "js-yaml";

export default async function updateMain(data: Playlist, filename: string) {
  try {
    const newContents = await buildNewMain(data, filename);
    return await writeFile(filename, newContents);
  } catch (error) {
    throw new Error(error);
  }
}

export async function buildNewMain(data: Playlist, filename: string) {
  try {
    const currentPlaylists: string | [] =
      (await readFile(filename, "utf-8")) || "";
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
    throw new Error(error);
  }
}
