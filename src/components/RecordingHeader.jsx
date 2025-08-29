import React from "react";
import PlayButton from "../components/PlayButton"; 

function SectionHeader({ dateLabel, duration, onPlay = () => {} }) {
  return (
    <div className="mt-6 mb-3">
      <div className="flex items-center gap-3 px-1">
        <div className="text-slate-700 font-semibold">{dateLabel}</div>
        <PlayButton
          onClick={onPlay}
          className="bg-button-record shadow hover:bg-indigo-700"
        />
      </div>

      <div className="mt-3 flex items-center gap-3 px-1">
        <input
          type="range"
          min="0"
          max="100"
          className="w-[280px] accent-button-record"
          readOnly
        />
        <div className="text-slate-500 text-xs">{duration}</div>
      </div>
    </div>
  );
}


export default SectionHeader;
