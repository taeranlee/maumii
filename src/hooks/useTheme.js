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
    isBear: currentTheme === "bear",
  };
}
