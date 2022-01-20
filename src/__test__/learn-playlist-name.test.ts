import { exportVariable } from "@actions/core";
import learnPlaylistName from "../learn-playlist-name";

process.env.YEAR = "2019";

jest.mock("@actions/core");

describe("learnPlaylistName", () => {
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
});
