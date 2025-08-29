// src/utils/themeUtils.js
export const THEMES = {
  cloud: {
    name: "cloud",
    profileImage: "/src/assets/emotion/cloud_calm.png", // 또는 실제 경로
    backgroundColor: "#E8F4FD",
    primaryColor: "#87CEEB"
  },
  bear: {
    name: "bear", 
    profileImage: "/src/assets/emotion/bear_calm.png", // 또는 실제 경로
    backgroundColor: "#FFF8DC",
    primaryColor: "#D2B48C"
  }
};

export const getThemeConfig = (themeName) => {
  return THEMES[themeName] || THEMES.cloud; // 기본값은 cloud
};

// src/hooks/useTheme.js
import { useAuth } from "../context/AuthContext";
import { getThemeConfig } from "../utils/themeUtils";

export function useTheme() {
  const { user } = useAuth();
  const currentTheme = user?.uTheme || "cloud";
  const themeConfig = getThemeConfig(currentTheme);
  
  return {
    currentTheme,
    themeConfig,
    isCloud: currentTheme === "cloud",
    isBear: currentTheme === "bear"
  };
}