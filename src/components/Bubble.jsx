import { memo } from "react";
import { useTheme } from "../hooks/useTheme";
import { getEmotionImg, defaultHeroByTheme } from "../utils/emotion";

// who: "me" | "partner"
// text: 말풍선 텍스트
// emotion: 감정 라벨 (예: "calm", "angry"...)
// showHero: 감정 이미지 보일지 여부
export default memo(function Bubble({
  who = "me",
  text = "",
  emotion = null,
  showHero = false,
}) {
  const { currentTheme } = useTheme();
  const HERO_IMG_CLASS = "w-48 h-48";

  return (
    <div>
      {showHero && (
        <div className="flex justify-center my-4">
          <img
            src={
              emotion
                ? getEmotionImg(currentTheme, emotion)
                : defaultHeroByTheme[currentTheme]
            }
            alt={emotion || "hero"}
            className={HERO_IMG_CLASS}
          />
        </div>
      )}

      <div className={`flex ${who === "me" ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-7 whitespace-pre-wrap
            ${
              who === "me"
                ? "bg-cloud-mine text-text-400 rounded-br-md"
                : "bg-cloud-partner text-text-400 rounded-bl-md"
            }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
});
