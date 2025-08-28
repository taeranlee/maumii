import { React } from "react";
import { getEmotionImg, defaultHero } from "../utils/emotion";

function Bubble({ me, text, sub, isActive, emotion }) {
  const avatar = getEmotionImg(emotion) || defaultHero;

  return (
    <div className={`mt-4 flex items-right gap-3 ${me ? "justify-end" : ""}`}>
      {/* 왼쪽 상대방 아바타 */}
      {!me && (
        <img
          src={avatar}
          alt={emotion || "avatar"}
          className="h-14 w-14 shrink-0 items-center"
          draggable={false}
        />
      )}

      {/* 말풍선 */}
      <div className={`max-w-[70%] ${me ? "text-left" : "text-left"}`}>
        <div
          className={[
            "rounded-2xl px-4 py-3 whitespace-pre-wrap leading-6 shadow text-[14px]",
            me
              ? "bg-cloud-mine text-slate-800 rounded-br-md"
              : "bg-cloud-partner text-slate-800 rounded-bl-md",
            isActive ? "shadow-[0_0_8px_rgba(126,104,255,0.7)]" : ""
          ].join(" ")}
        >
          {text}
        </div>
        {sub && (
          <div
            className={`mt-1 text-xs text-slate-400 ${
              me ? "text-right" : "text-left"
            }`}
          >
            {sub}
          </div>
        )}
      </div>

      {/* 오른쪽 내 아바타 */}
      {me && (
        <img
          src={avatar}
          alt={emotion || "avatar"}
          className="h-14 w-14 shrink-0 items-center"
          draggable={false}
        />
      )}
    </div>
  );
}

export default Bubble;