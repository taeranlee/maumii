// export default function Navigation() {
//   return (
//     <nav className="h-14 shrink-0 bg-white border-t flex items-center justify-around">
//       <button className="text-blue-600 text-sm">홈</button>
//       <button className="text-slate-500 text-sm">검색</button>
//       <button className="text-slate-500 text-sm">마이</button>
//     </nav>
//   );
// }

// BottomNav.jsx
import { useMemo } from "react";

/** 사용법
 * <BottomNav active="mic" onChange={(key) => setActive(key)} />
 * active: 'record' | 'mic' | 'mypage'
 */
export default function Navigation({ active = "mic", onChange }) {
  const is = (k) => active === k;

  // 공통 스타일
  const tabBase =
    "flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl transition";
  const labelBase = "text-xs font-medium";

  // 색상(활성/비활성)
  const tone = useMemo(
    () => ({
      icon: (k) =>
        is(k) ? "text-purple-700" : "text-slate-400",
      text: (k) =>
        is(k) ? "text-purple-700" : "text-slate-400",
    }),
    [active]
  );

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* 배경 바 */}
      <div className="relative z-0 flex items-center justify-between rounded-3xl bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        {/* 왼쪽 탭: 기록 */}
        <button
          type="button"
          onClick={() => onChange?.("record")}
          className={`${tabBase} ${is("record") ? "bg-white" : ""}`}
          aria-current={is("record") ? "page" : undefined}
        >
          <ArchiveIcon className={`h-5 w-5 ${tone.icon("record")}`} />
          <span className={`${labelBase} ${tone.text("record")}`}>기록</span>
        </button>

        {/* 오른쪽 탭: 마이페이지 */}
        <button
          type="button"
          onClick={() => onChange?.("mypage")}
          className={`${tabBase} ${is("mypage") ? "bg-white" : ""}`}
          aria-current={is("mypage") ? "page" : undefined}
        >
          <UserIcon className={`h-5 w-5 ${tone.icon("mypage")}`} />
          <span className={`${labelBase} ${tone.text("mypage")}`}>마이페이지</span>
        </button>
      </div>

      {/* 상단 볼록-노치(배경) */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
      />

      {/* 가운데 플로팅 마이크 버튼 */}
      <button
        type="button"
        onClick={() => onChange?.("mic")}
        className={`group absolute left-1/2 top-0 z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full
          bg-purple-600 shadow-[0_10px_20px_rgba(99,102,241,0.45)] ring-4 ring-white transition
          hover:scale-105 active:scale-95
          ${is("mic") ? "" : ""}`}
        aria-current={is("mic") ? "page" : undefined}
      >
        <MicIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}

/* --- 간단 SVG 아이콘 (의존성 없이 사용) --- */
function ArchiveIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M3 4.75A1.75 1.75 0 0 1 4.75 3h14.5A1.75 1.75 0 0 1 21 4.75v2.5A1.75 1.75 0 0 1 19.25 9H4.75A1.75 1.75 0 0 1 3 7.25v-2.5Zm2 .25h14v2H5v-2Zm0 5h14v8.25A1.75 1.75 0 0 1 17.25 21H6.75A1.75 1.75 0 0 1 5 18.25V10Zm4 3.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" />
    </svg>
  );
}
function MicIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11a1 1 0 1 0-2 0Z" />
    </svg>
  );
}
function UserIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}
