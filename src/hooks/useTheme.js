import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getThemeConfig } from "../utils/themeUtils";

export function useTheme() {
  const { user } = useAuth();
  const [domTheme, setDomTheme] = useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme")
      : null
  );

  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const target = document.documentElement;
    const obs = new MutationObserver(() => {
      setDomTheme(target.getAttribute("data-theme"));
    });
    obs.observe(target, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // DOM > user > fallback
  const currentTheme = (domTheme || user?.uTheme || "cloud").toLowerCase();
  const themeConfig = getThemeConfig(currentTheme);

  return {
    currentTheme,
    themeConfig,
    isCloud: currentTheme === "cloud",
    isBear: currentTheme === "bear",
  };
}
