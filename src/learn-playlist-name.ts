import { getInput } from "@actions/core";
import * as github from "@actions/github";

export default function learnPlaylistName(): string {
  const payload = github.context.payload.inputs;
  if (payload && payload["playlist-name"]) {
    return payload["playlist-name"];
  }

  const today = new Date();
  const month = process.env.MONTH
    ? parseInt(process.env.MONTH)
    : today.getMonth();
  const year = process.env.YEAR
    ? parseInt(process.env.YEAR)
    : today.getFullYear();
  const [marchEnd, juneEnd, septemberEnd, decemberEnd] = validateSeasonNames();
  const seasons = {
    2: marchEnd,
    5: juneEnd,
    8: septemberEnd,
    11: decemberEnd,
  };
  const season = seasons[month];
  if (!season)
    throw new Error(`The current month does not match an end of season month.`);
  return `${month === 2 ? `${year - 1}/${year}` : year} ${season}`;
}

function validateSeasonNames() {
  const seasonNames = getInput("season-names")
    .split(",")
    .map((s) => s.trim());
  if (seasonNames.length !== 4)
    throw new Error(
      `There must be 4 seasons listed in \`season-names\` only found ${seasonNames.length} (\`${seasonNames}\`).`
    );
  return seasonNames;
}
