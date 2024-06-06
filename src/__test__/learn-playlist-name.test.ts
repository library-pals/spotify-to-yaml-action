import learnPlaylistName from "../learn-playlist-name";
import * as core from "@actions/core";
import * as github from "@actions/github";

jest.mock("@actions/core");

const defaultInputs = {
  "season-names": "Winter,Spring,Summer,Fall",
  filename: "_data/playlists.yml",
};

describe("learnPlaylistName", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((name) => defaultInputs[name] || undefined);
  });
  afterEach(() => {
    jest.spyOn(global, "Date").mockRestore();
  });
  test("Summer", () => {
    const mockDate = new Date(2019, 8); // September
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    expect(learnPlaylistName()).toEqual(`2019 Summer`);
  });

  test("Fall", () => {
    const mockDate = new Date(2019, 11); // December
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    expect(learnPlaylistName()).toEqual(`2019 Fall`);
  });

  test("Winter", () => {
    const mockDate = new Date(2019, 2); // March
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    expect(learnPlaylistName()).toEqual(`2018/2019 Winter`);
  });

  test("Spring", () => {
    const mockDate = new Date(2019, 5); // June
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    expect(learnPlaylistName()).toEqual(`2019 Spring`);
  });

  test("Change season order", () => {
    const mockDate = new Date(2019, 5); // June
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    defaultInputs["season-names"] = "Summer,Fall,Winter,Spring";
    expect(learnPlaylistName()).toEqual(`2019 Fall`);
  });

  test("Month does not match end of season month", () => {
    const mockDate = new Date(2019, 1); // February
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    expect(() => learnPlaylistName()).toThrow(
      "The current month (1) does not match an end of season month: 2,5,8,11."
    );
  });

  test("Invalid season-names", () => {
    const mockDate = new Date(2019, 5); // June
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    defaultInputs["season-names"] = "Summer";
    expect(() => learnPlaylistName()).toThrow(
      "There must be 4 seasons listed in `season-names` only found 1 (`Summer`)."
    );
  });

  test("Set workflow input `playlist-name`", () => {
    const mockDate = new Date(2019, 1); // February
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            "playlist-name": "2020 Fall",
          },
        },
      },
    });
    expect(learnPlaylistName()).toEqual("2020 Fall");
  });
});
