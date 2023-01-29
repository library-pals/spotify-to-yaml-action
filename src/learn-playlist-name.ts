import { exportVariable, getInput } from "@actions/core";

export default function learnPlaylistName(): string {
  const today = new Date();
  const month = process.env.MONTH
    ? parseInt(process.env.MONTH)
    : today.getMonth();
  const year = process.env.YEAR
    ? parseInt(process.env.YEAR)
    : today.getFullYear();
  const [marchEnd, juneEnd, septemberEnd, decemberEnd] = getInput("seasonNames")
    .split(",")
    .map((s) => s.trim());
  const season = {
    2: marchEnd,
    5: juneEnd,
    8: septemberEnd,
    11: decemberEnd,
  };
  const name = `${month === 2 ? `${year - 1}/${year}` : year} ${season[month]}`;
  exportVariable("playlist", name);
  return name;
}
