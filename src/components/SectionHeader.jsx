import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { fmtClock } from "../utils/time";   // ⬅️ 추가

function SectionHeader({
  dateLabel,
  duration,          // 기존 라벨(백업용)
  progress = 0,
  onPlay = () => {},
  onSeek = null,
  isActive = false,
  isPlaying = false,
  currentMs = 0,     // ⬅️ 현재 재생 위치(ms)
  totalMs = 0,       // ⬅️ 총 길이(ms)
}) {
  const pct = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const currentLabel = fmtClock(currentMs);
  const totalLabel   = fmtClock(totalMs);

  return (
    <div className="mt-6 mb-3">
      <div className="flex items-center gap-3 px-3">
        <div className="text-slate-700 font-semibold">{dateLabel}</div>
        <button
          onClick={onPlay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-button-record text-white shadow"
        >
          {isActive && isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4 ml-1" />}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 px-1">
        <input
          type="range"
          min="0"
          max="1000"
          value={Math.round(pct * 1000)}
          onChange={(e) => onSeek && onSeek(Number(e.target.value) / 1000)}
          className="w-[280px] accent-button-record"
        />
        <div className="text-slate-500 text-xs whitespace-nowrap">
          {currentLabel} / {totalLabel}
        </div>
      </div>
    </div>
  );
}

export default SectionHeader;