import { exportVariable } from "@actions/core";
import learnPlaylistName from "../learn-playlist-name";
import * as core from "@actions/core";
import * as github from "@actions/github";

process.env.YEAR = "2019";

jest.mock("@actions/core");

const defaultInputs = {
  seasonNames: "Winter,Spring,Summer,Fall",
  fileName: "_data/playlists.yml",
};

describe("learnPlaylistName", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((name) => defaultInputs[name] || undefined);
  });
  test("Summer", () => {
    process.env.MONTH = "8";
    expect(learnPlaylistName()).toEqual(`${process.env.YEAR} Summer`);
    expect(exportVariable).toHaveBeenCalledWith(
      "playlist",
      `${process.env.YEAR} Summer`
    );
  });

  test("Fall", () => {
    process.env.MONTH = "11";
    expect(learnPlaylistName()).toEqual(`${process.env.YEAR} Fall`);
    expect(exportVariable).toHaveBeenCalledWith(
      "playlist",
      `${process.env.YEAR} Fall`
    );
  });

  test("Winter", () => {
    process.env.MONTH = "2";
    expect(learnPlaylistName()).toEqual(
      `${parseInt(process.env.YEAR) - 1}/${process.env.YEAR} Winter`
    );
    expect(exportVariable).toHaveBeenCalledWith(
      "playlist",
      `${parseInt(process.env.YEAR) - 1}/${process.env.YEAR} Winter`
    );
  });

  test("Spring", () => {
    process.env.MONTH = 5;
    expect(learnPlaylistName()).toEqual(`${process.env.YEAR} Spring`);
    expect(exportVariable).toHaveBeenCalledWith(
      "playlist",
      `${process.env.YEAR} Spring`
    );
  });

  test("Change season order", () => {
    process.env.MONTH = 5;
    defaultInputs.seasonNames = "Summer,Fall,Winter,Spring";
    expect(learnPlaylistName()).toEqual(`${process.env.YEAR} Fall`);
    expect(exportVariable).toHaveBeenCalledWith(
      "playlist",
      `${process.env.YEAR} Fall`
    );
  });

  test("Month does not match end of season month", () => {
    process.env.MONTH = 1;
    expect(() => learnPlaylistName()).toThrow(
      "The current month does not match an end of season month."
    );
  });

  test("Invalid seasonNames", () => {
    process.env.MONTH = 5;
    defaultInputs.seasonNames = "Summer";
    expect(() => learnPlaylistName()).toThrow(
      "There must be 4 seasons listed in `seasonNames` only found 1 (`Summer`)."
    );
  });

  test("Set workflow input `playlistName`", () => {
    process.env.MONTH = 1;
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            playlistName: "2020 Fall",
          },
        },
      },
    });
    expect(learnPlaylistName()).toEqual("2020 Fall");
    expect(exportVariable).toHaveBeenCalledWith("playlist", "2020 Fall");
  });
});
