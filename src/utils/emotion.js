const cloudImgs = import.meta.glob("../assets/images/emotion/cloud_*.png", {
  eager: true,
  import: "default",
});
const bearImgs = import.meta.glob("../assets/images/emotion/bear_*.png", {
  eager: true,
  import: "default",
});

export const defaultHeroByTheme = {
  cloud: new URL("../assets/images/emotion/cloud_calm.png", import.meta.url)
    .href,
  bear: new URL("../assets/images/emotion/bear_calm.png", import.meta.url).href,
};

export function getEmotionImg(theme, label) {
  const t = theme === "bear" ? "bear" : "cloud";
  const map = t === "bear" ? bearImgs : cloudImgs;

  if (!label) return defaultHeroByTheme[t];
  const key = `../assets/images/emotion/${t}_${String(
    label
  ).toLowerCase()}.png`;
  return map[key] ?? defaultHeroByTheme[t];
}
