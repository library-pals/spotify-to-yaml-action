/* eslint-disable @typescript-eslint/no-var-requires */
import { action } from "..";
import * as UpdateMain from "../write-file";
import * as core from "@actions/core";
import * as ListPlaylists from "../list-playlists";
import * as LearnPlaylistName from "../learn-playlist-name";
import { promises } from "fs";

jest.mock("@actions/core");
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
    const learnPlaylistNameSpy = jest.spyOn(LearnPlaylistName, "default");
    const listPlaylistsSpy = jest.spyOn(ListPlaylists, "default");
    const updateMainSpy = jest.spyOn(UpdateMain, "default");
    jest.spyOn(promises, "readFile").mockResolvedValue(`
- playlist: 2021 Summer
`);
    const writeFileSpy = jest.spyOn(promises, "writeFile").mockImplementation();
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    jest
      .spyOn(core, "getInput")
      .mockImplementation(() => "_data/playlists.yml");

    await action();
    expect(learnPlaylistNameSpy).toHaveReturnedWith("2021 Fall");
    const results = listPlaylistsSpy.mock.results[0].value;
    await expect(results).resolves.toMatchSnapshot();
    expect(exportVariableSpy).toHaveBeenNthCalledWith(
      1,
      "playlist",
      "2021 Fall"
    );
    expect(exportVariableSpy).toHaveBeenNthCalledWith(
      2,
      "PlaylistImageOutput",
      "2021-fall.png"
    );
    expect(exportVariableSpy).toHaveBeenNthCalledWith(
      3,
      "PlaylistImage",
      "https://mosaic.scdn.co/640/ab67616d0000b27304a205b54b5c1fbae8543efaab67616d0000b27364fa86e376b0279aa49a1832ab67616d0000b273acddc5a09b8cb4730995b60aab67616d0000b273ba738766498bddccae3d319a"
    );
    expect(updateMainSpy.mock.calls[0]).toMatchSnapshot();
    expect(writeFileSpy.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "_data/playlists.yml",
        "- playlist: 2021 Summer
      - playlist: 2021 Fall
        spotify: https://open.spotify.com/playlist/2YnPs9UNBkJpswmsRNwQ1o
        tracks:
          - track: can't stop me from dying
            artist: Ada Lea
            album: one hand on the steering wheel the other sewing a garden
          - track: No Shadow
            artist: Hyd
            album: No Shadow
          - track: Trip To Japan
            artist: The Shacks
            album: Trip To Japan
          - track: Maker
            artist: Hana Vu
            album: Keeper
          - track: Anything at All
            artist: Bachelor, Jay Som, Palehound
            album: Doomin' Sun
          - track: Would You Mind Please Pulling Me Close?
            artist: Tasha
            album: Would You Mind Please Pulling Me Close?
          - track: Genesis
            artist: Spencer.
            album: Genesis
          - track: Old Peel
            artist: Aldous Harding
            album: Old Peel
          - track: Everybody's Birthday
            artist: Hana Vu
            album: Everybody's Birthday
          - track: Big Wheel
            artist: Samia
            album: The Baby
          - track: Dogma
            artist: Circuit des Yeux
            album: '-io'
          - track: I'm Holding Out For Something
            artist: Virginia Wing
            album: private LIFE
          - track: Delicious Things
            artist: Wolf Alice
            album: Blue Weekend
          - track: Bottle Episode
            artist: Mandy, Indiana
            album: Bottle Episode
          - track: The Gaping Mouth
            artist: Lowertown
            album: The Gaping Mouth
          - track: 3 2 4 3
            artist: Ohmme
            album: Fantasize Your Ghost
          - track: Of Pressure
            artist: Mirah
            album: You Think It's Like This But Really It's Like This
          - track: When the Sun Comes Up
            artist: Greta Morgan
            album: When the Sun Comes Up
          - track: Mountains Crave
            artist: Anna von Hausswolff
            album: Ceremony
      ",
      ]
    `);
  });
});
