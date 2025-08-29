// src/utils/themeUtils.js
export const THEMES = {
  cloud: {
    name: "cloud",
    displayName: "구름 테마",
    profileImage: "/src/assets/emotion/cloud.png", // 실제 이미지 경로로 수정
    backgroundColor: "#E8F4FD",
    primaryColor: "#87CEEB",
    emoji: "☁️",
  },
  bear: {
    name: "bear",
    displayName: "곰 테마",
    profileImage: "/src/assets/emotion/bear.png", // 실제 이미지 경로로 수정
    backgroundColor: "#FFF8DC",
    primaryColor: "#D2B48C",
    emoji: "🧸",
  },
};

export const getThemeConfig = (themeName) => {
  return THEMES[themeName] || THEMES.cloud; // 기본값은 cloud
};
