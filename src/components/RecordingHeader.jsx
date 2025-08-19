import React from "react";
import { PlayButton } from "../components/PlayButton"; 

function SectionHeader({ dateLabel, duration }) {
  return (
    <div className="mt-6 mb-3">
      <div className="flex items-center gap-3 px-1">
        <div className="text-slate-700 font-semibold">{dateLabel}</div>
        <button className="grid h-8 w-8 place-items-center rounded-full bg-white shadow">
          <PlayButton className="" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3 px-1">
        <input
          type="range"
          min="0"
          max="100"
          className="w-full accent-indigo-500"
          readOnly
        />
        <div className="text-slate-500 text-sm">{duration}</div>
      </div>
    </div>
  );
}

export default SectionHeader;
