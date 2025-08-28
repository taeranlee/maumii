const emotionImgs = import.meta.glob("../assets/images/cloud_*.png", {
  eager: true,
  import: "default",
});
export const defaultHero = new URL("../assets/images/cloud_calm.png", import.meta.url).href;

export function getEmotionImg(label) {
  if (!label) return defaultHero;
  const key = `../assets/images/cloud_${label}.png`;
  return emotionImgs[key] ?? defaultHero;
}