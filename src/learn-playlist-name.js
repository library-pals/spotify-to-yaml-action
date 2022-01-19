import { exportVariable } from "@actions/core";

export default function learnPlaylistName() {
  const today = new Date();
  const month = process.env.MONTH || today.getMonth();
  const year = process.env.YEAR || today.getFullYear();
  const season = {
    2: "Winter",
    5: "Spring",
    8: "Summer",
    11: "Fall",
  };
  const name = `${month == 2 ? `${year - 1}/${year}` : year} ${season[month]}`;
  exportVariable("playlist", name);
  return name;
}
