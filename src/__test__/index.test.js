import { action } from "..";
import {
  formatTracks,
  updateMain,
  saveImage,
} from "spotify-to-jekyll/index.js";
import spotifyToJekyll from "spotify-to-jekyll/index.js";
import { exportVariable, info } from "@actions/core";

jest.mock("@actions/core");
jest.mock("spotify-to-jekyll/index.js");
jest.mock("fs");
jest.mock("spotify-web-api-node", () => {
  return jest.fn().mockImplementation(() => {
    const userPlaylists = require("./fixtures/get-user-playlists.json");
    const playlistTracks = require("./fixtures/get-playlist-tracks.json");
    return {
      clientCredentialsGrant: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ body: { access_token: "token" } })
        ),
      setAccessToken: jest.fn(),
      getUserPlaylists: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ body: userPlaylists })),
      getPlaylistTracks: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ body: { items: playlistTracks } })
        ),
    };
  });
});

describe("action", () => {
  test("works", async () => {
    process.env.MONTH = 11;
    process.env.YEAR = 2021;
    jest.spyOn(spotifyToJekyll, "playlist").mockImplementation(() => {});
    await action();
    expect(exportVariable).toHaveBeenCalledWith("playlist", "2021 Fall");
    expect(info).toHaveBeenCalled();
    expect(formatTracks).toHaveBeenCalled();
    expect(updateMain).toHaveBeenCalled();
    expect(saveImage).toHaveBeenCalled();
  });
});
