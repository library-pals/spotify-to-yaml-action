import { setFailed } from "@actions/core";
import { promises } from "fs";
import updateMain from "../write-file";

const playlist = {
  name: "2021 Fall",
  formatted_name: "2021-fall",
  url: "https://open.spotify.com/playlist/2YnPs9UNBkJpswmsRNwQ1o",
  tracks: [
    {
      name: "can't stop me from dying",
      artist: "Ada Lea",
      album: "one hand on the steering wheel the other sewing a garden",
    },
    { name: "No Shadow", artist: "Hyd", album: "No Shadow" },
    { name: "Trip To Japan", artist: "The Shacks", album: "Trip To Japan" },
    { name: "Maker", artist: "Hana Vu", album: "Keeper" },
    {
      name: "Anything at All",
      artist: "Bachelor, Jay Som, Palehound",
      album: "Doomin' Sun",
    },
    {
      name: "Would You Mind Please Pulling Me Close?",
      artist: "Tasha",
      album: "Would You Mind Please Pulling Me Close?",
    },
    { name: "Genesis", artist: "Spencer.", album: "Genesis" },
    { name: "Old Peel", artist: "Aldous Harding", album: "Old Peel" },
    {
      name: "Everybody's Birthday",
      artist: "Hana Vu",
      album: "Everybody's Birthday",
    },
    { name: "Big Wheel", artist: "Samia", album: "The Baby" },
    { name: "Dogma", artist: "Circuit des Yeux", album: "-io" },
    {
      name: "I'm Holding Out For Something",
      artist: "Virginia Wing",
      album: "private LIFE",
    },
    { name: "Delicious Things", artist: "Wolf Alice", album: "Blue Weekend" },
    {
      name: "Bottle Episode",
      artist: "Mandy, Indiana",
      album: "Bottle Episode",
    },
    {
      name: "The Gaping Mouth",
      artist: "Lowertown",
      album: "The Gaping Mouth",
    },
    { name: "3 2 4 3", artist: "Ohmme", album: "Fantasize Your Ghost" },
    {
      name: "Of Pressure",
      artist: "Mirah",
      album: "You Think It's Like This But Really It's Like This",
    },
    {
      name: "When the Sun Comes Up",
      artist: "Greta Morgan",
      album: "When the Sun Comes Up",
    },
    {
      name: "Mountains Crave",
      artist: "Anna von Hausswolff",
      album: "Ceremony",
    },
  ],
  image: "2021-fall.png",
};

jest.mock("@actions/core");

describe("updateMain", () => {
  test("works", async () => {
    jest.spyOn(promises, "writeFile").mockResolvedValueOnce();
    jest.spyOn(promises, "readFile").mockImplementation();
    await updateMain(playlist, "myfile.yml");
    expect(promises.writeFile).toHaveBeenCalled();
  });
  test("write fails", async () => {
    jest.spyOn(promises, "writeFile").mockRejectedValue("Error");
    jest.spyOn(promises, "readFile").mockImplementation();
    await updateMain(playlist, "myfile.yml");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
  test("read fails", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    await updateMain(playlist, "myfile.yml");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
