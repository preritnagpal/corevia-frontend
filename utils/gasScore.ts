export function gasToScore(
  value: number | null,
  type: "so2" | "no2" | "co" | "pm25"
): number | null {
  if (value === null || !Number.isFinite(value)) return null;

  const abs = Math.abs(value);

  let score = 0;

  switch (type) {
    case "so2":
      score = abs * 500000;
      break;
    case "no2":
      score = abs * 300000;
      break;
    case "co":
      score = abs * 3000;
      break;
    case "pm25":
      score = abs / 3;
      break;
  }

  // 🔥 VERY IMPORTANT
  if (!Number.isFinite(score) || score <= 0) return null;

  return Math.min(100, score);
}
