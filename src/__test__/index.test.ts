import { action } from "..";
import formatTracks from "spotify-to-jekyll/src/format-tracks.js";
import updateMain from "spotify-to-jekyll/src/update-main.js";
import saveImage from "spotify-to-jekyll/src/save-image.js";
import { exportVariable } from "@actions/core";

jest.mock("@actions/core");
jest.mock("spotify-to-jekyll/src/format-tracks.js");
jest.mock("spotify-to-jekyll/src/update-main.js");
jest.mock("spotify-to-jekyll/src/save-image.js");
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
    process.env.MONTH = "11";
    process.env.YEAR = "2021";
    await action();
    expect(exportVariable).toHaveBeenCalledWith("playlist", "2021 Fall");
    expect(formatTracks.mock.calls[1]).toMatchSnapshot();
    expect(updateMain).toHaveBeenCalled();
    expect(saveImage).toHaveBeenCalled();
  });
});
