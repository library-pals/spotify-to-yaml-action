import { getInput } from "@actions/core";
import * as github from "@actions/github";

export default function learnPlaylistName(): string {
  // Extract the playlist name from the payload if it exists
  const payload = github?.context?.payload?.inputs;
  if (payload && payload["playlist-name"]) {
    return payload["playlist-name"];
  }

  return getSeasonalPlaylistName();
}

function getSeasonalPlaylistName(): string {
  const { month, year } = getMonthYear();
  const season = getSeason(month);
  // Return the playlist name, which is the year and season name
  // If the month is March, the year is the previous year and the current year
  const playlistYear = month === 2 ? `${year - 1}/${year}` : year;
  return `${playlistYear} ${season}`;
}

function getSeason(month: number): string {
  // Define the end of season names
  const [marchEnd, juneEnd, septemberEnd, decemberEnd] = validateSeasonNames();

  // Map the end of season months to their names
  const seasons: Record<number, string> = {
    2: marchEnd,
    5: juneEnd,
    8: septemberEnd,
    11: decemberEnd,
  };

  // Get the season name for the current month
  const season = seasons[month];

  // Throw an error if the current month is not an end of season month
  if (!season) {
    throw new Error(
      `The current month (${month}) does not match an end of season month: ${Object.keys(
        seasons
      )}.`
    );
  }

  return season;
}

function getMonthYear(): { month: number; year: number } {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  return {
    month,
    year,
  };
}

function validateSeasonNames(): string[] {
  const seasonNames = getInput("season-names")
    .split(",")
    .map((s) => s.trim());
  if (seasonNames.length !== 4)
    throw new Error(
      `There must be 4 seasons listed in \`season-names\` only found ${seasonNames.length} (\`${seasonNames}\`).`
    );
  return seasonNames;
}
