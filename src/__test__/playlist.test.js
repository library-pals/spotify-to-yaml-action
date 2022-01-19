"use strict";

const playlist = require("../src/index.js");

process.env.YEAR = 2019;

jest.mock("@actions/core");

describe("learnPlaylistName", () => {
  test("Summer", async () => {
    process.env.MONTH = 8;
    expect(await playlist.learnPlaylistName()).toEqual(
      `${process.env.YEAR} Summer`
    );
  });

  test("Fall", async () => {
    process.env.MONTH = 11;
    expect(await playlist.learnPlaylistName()).toEqual(
      `${process.env.YEAR} Fall`
    );
  });

  test("Winter", async () => {
    process.env.MONTH = 2;
    expect(await playlist.learnPlaylistName()).toEqual(
      `${process.env.YEAR - 1}/${process.env.YEAR} Winter`
    );
  });

  test("Spring", async () => {
    process.env.MONTH = 5;
    expect(await playlist.learnPlaylistName()).toEqual(
      `${process.env.YEAR} Spring`
    );
  });
});
