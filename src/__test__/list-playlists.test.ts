/* eslint-disable @typescript-eslint/no-require-imports */

import listPlaylists, { formatName, formatTracks } from "../list-playlists";
import { getInput } from "@actions/core";
import SpotifyWebApi from "spotify-web-api-node";

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

jest.mock("@actions/core");

describe("listPlaylists", () => {
  beforeEach(() => {
    process.env.SpotifyClientID = "test-client-id";
    process.env.SpotifyClientSecret = "test-client-secret";
    jest.clearAllMocks();
  });
  test("returns", async () => {
    expect(await listPlaylists("2021 Fall")).toMatchInlineSnapshot(`
{
  "formatted_name": "2021-fall",
  "image": "https://mosaic.scdn.co/640/ab67616d0000b27304a205b54b5c1fbae8543efaab67616d0000b27364fa86e376b0279aa49a1832ab67616d0000b273acddc5a09b8cb4730995b60aab67616d0000b273ba738766498bddccae3d319a",
  "name": "2021 Fall",
  "tracks": [
    {
      "album": "one hand on the steering wheel the other sewing a garden",
      "artist": "Ada Lea",
      "name": "can't stop me from dying",
    },
    {
      "album": "No Shadow",
      "artist": "Hyd",
      "name": "No Shadow",
    },
    {
      "album": "Trip To Japan",
      "artist": "The Shacks",
      "name": "Trip To Japan",
    },
    {
      "album": "Keeper",
      "artist": "Hana Vu",
      "name": "Maker",
    },
    {
      "album": "Doomin' Sun",
      "artist": "Bachelor, Jay Som, Palehound",
      "name": "Anything at All",
    },
    {
      "album": "Would You Mind Please Pulling Me Close?",
      "artist": "Tasha",
      "name": "Would You Mind Please Pulling Me Close?",
    },
    {
      "album": "Genesis",
      "artist": "Spencer.",
      "name": "Genesis",
    },
    {
      "album": "Old Peel",
      "artist": "Aldous Harding",
      "name": "Old Peel",
    },
    {
      "album": "Everybody's Birthday",
      "artist": "Hana Vu",
      "name": "Everybody's Birthday",
    },
    {
      "album": "The Baby",
      "artist": "Samia",
      "name": "Big Wheel",
    },
    {
      "album": "-io",
      "artist": "Circuit des Yeux",
      "name": "Dogma",
    },
    {
      "album": "private LIFE",
      "artist": "Virginia Wing",
      "name": "I'm Holding Out For Something",
    },
    {
      "album": "Blue Weekend",
      "artist": "Wolf Alice",
      "name": "Delicious Things",
    },
    {
      "album": "Bottle Episode",
      "artist": "Mandy, Indiana",
      "name": "Bottle Episode",
    },
    {
      "album": "The Gaping Mouth",
      "artist": "Lowertown",
      "name": "The Gaping Mouth",
    },
    {
      "album": "Fantasize Your Ghost",
      "artist": "Ohmme",
      "name": "3 2 4 3",
    },
    {
      "album": "You Think It's Like This But Really It's Like This",
      "artist": "Mirah",
      "name": "Of Pressure",
    },
    {
      "album": "When the Sun Comes Up",
      "artist": "Greta Morgan",
      "name": "When the Sun Comes Up",
    },
    {
      "album": "Ceremony",
      "artist": "Anna von Hausswolff",
      "name": "Mountains Crave",
    },
  ],
  "url": "https://open.spotify.com/playlist/2YnPs9UNBkJpswmsRNwQ1o",
}
`);
  });

  it("throws an error when the playlist has no tracks", async () => {
    // Mock the getInput function to return a valid username
    getInput.mockImplementation(() => "test-username");

    // Mock the SpotifyWebApi methods
    const mockClientCredentialsGrant = jest.fn().mockResolvedValue({
      body: { access_token: "test-access-token" },
    });
    const mockGetUserPlaylists = jest.fn().mockResolvedValue({
      body: {
        items: [
          {
            name: "test-playlist",
            id: "test-playlist-id",
          },
        ],
      },
    });
    const mockGetPlaylistTracks = jest.fn().mockResolvedValue({
      body: { items: [] },
    });

    SpotifyWebApi.mockImplementation(() => ({
      clientCredentialsGrant: mockClientCredentialsGrant,
      getUserPlaylists: mockGetUserPlaylists,
      getPlaylistTracks: mockGetPlaylistTracks,
      setAccessToken: jest.fn(),
    }));

    // Call the function and expect an error to be thrown
    await expect(listPlaylists("test-playlist")).rejects.toThrow(
      "Playlist has no tracks."
    );
  });

  test("cannot find", async () => {
    await expect(listPlaylists("2022 Fall")).rejects.toThrow(
      'Could not find playlist "2022 Fall". Is it private?'
    );
  });

  test("throw error when SpotifyClientID or SpotifyClientSecret is missing", async () => {
    delete process.env.SpotifyClientID;
    delete process.env.SpotifyClientSecret;

    await expect(listPlaylists("2021 Fall")).rejects.toThrow(
      "Missing SpotifyClientID or SpotifyClientSecret in environment variables"
    );
  });
});

describe("formatTracks", () => {
  it("formats the playlist name correctly", () => {
    const playlist = {
      name: "Test / Playlist!",
      external_urls: { spotify: "https://spotify.com" },
      images: [
        { url: "https://image1.com", width: 500 },
        { url: "https://image2.com" },
        { url: "https://image3.com" },
      ],
      tracks: [
        {
          track: {
            name: "Test Track",
            artists: [{ name: "Test Artist" }],
            album: { name: "Test Album" },
          },
        },
      ],
    };

    const result = formatTracks(playlist);

    expect(result).toMatchInlineSnapshot(`
{
  "formatted_name": "test-playlist",
  "image": "https://image1.com",
  "name": "Test / Playlist!",
  "tracks": [
    {
      "album": "Test Album",
      "artist": "Test Artist",
      "name": "Test Track",
    },
  ],
  "url": "https://spotify.com",
}
`);
  });
});

describe("formatName", () => {
  it("formats the name correctly", () => {
    expect(formatName("2021 Fall")).toBe("2021-fall");
    expect(formatName("2020/2021 Winter")).toBe("2020-2021-winter");
    expect(formatName("2020 / 2021 Winter")).toBe("2020-2021-winter");
  });
});
