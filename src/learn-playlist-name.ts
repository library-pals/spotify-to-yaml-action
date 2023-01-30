import { exportVariable, getInput } from "@actions/core";
import * as github from "@actions/github";

export default function learnPlaylistName(): string {
  let playlistName;
  const payload = github.context.payload.inputs;
  if (payload && payload.playlistName) {
    playlistName = payload.playlistName;
  }

  if (!playlistName) {
    const today = new Date();
    const month = process.env.MONTH
      ? parseInt(process.env.MONTH)
      : today.getMonth();
    const year = process.env.YEAR
      ? parseInt(process.env.YEAR)
      : today.getFullYear();
    const [marchEnd, juneEnd, septemberEnd, decemberEnd] = getInput(
      "seasonNames"
    )
      .split(",")
      .map((s) => s.trim());
    const seasons = {
      2: marchEnd,
      5: juneEnd,
      8: septemberEnd,
      11: decemberEnd,
    };
    const season = seasons[month];
    if (!season)
      throw new Error(
        `The current month does not match an end of season month.`
      );
    playlistName = `${month === 2 ? `${year - 1}/${year}` : year} ${season}`;
  }
  exportVariable("playlist", playlistName);
  return playlistName;
}
