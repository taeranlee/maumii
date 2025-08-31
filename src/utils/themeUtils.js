// src/utils/themeUtils.js
import cloudImg from "../assets/images/emotion/cloud_calm.png";
import bearImg from "../assets/images/emotion/bear_calm.png";

export const THEMES = {
  cloud: {
    name: "cloud",
    displayName: "구름 테마",
    profileImage: cloudImg,
    backgroundColor: "#E8F4FD",
    primaryColor: "#87CEEB",
    emoji: "☁️",
  },
  bear: {
    name: "bear",
    displayName: "곰 테마",
    profileImage: bearImg,
    backgroundColor: "#FFF8DC",
    primaryColor: "#D2B48C",
    emoji: "🧸",
  },
};

export const TOKENS = {
  cloud: { partner: "#BDD6F3", mine: "#F8CBDE", ring: "108 81 199" },
  bear: { partner: "#FAF2C7", mine: "#F8DCCB", ring: "255 119 78" },
};
export const getBubbleBg = (theme, me) =>
  (TOKENS[theme] ?? TOKENS.cloud)[me ? "mine" : "partner"];

export const getRingRGB = (theme) => (TOKENS[theme] ?? TOKENS.cloud).ring;

export const getThemeConfig = (themeName) => {
  return THEMES[themeName] || THEMES.cloud;
};
