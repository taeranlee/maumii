export default function LevelSelector({ level, setLevel }) {
  // 1) level 값을 문자열 "true"/"false" 로 정규화 (boolean도 허용)
  const norm = (v) => {
    if (v === true || v === "true") return "true";
    if (v === false || v === "false") return "false";
    return "false"; // 폴백
  };
  const lvKey = norm(level);

  const LEVELS = [
    { key: "false", label: "다 볼게요" },
    { key: "true",  label: "안 좋은 건 잠시 가릴게요" },
  ];

  const LEVELS_MSG = {
    false: [
      "욕설이나 비하의 목적으로 사용되는 단어",
      "모두 필터링 없이 보여줍니다.",
    ],
    true: [
      "비하의 목적으로 사용되는 단어는 가려집니다.",
      "자극적인 말이 반복되면 마음이가 잠시 나타납니다.",
    ],
  };

  const msgs = LEVELS_MSG[lvKey] ?? []; // 2) 안전 폴백

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-800">노출 레벨 선택</h2>

      <div className="space-y-3">
        {LEVELS.map((lv) => {
          const active = lvKey === lv.key;
          return (
            <button
              key={lv.key}
              type="button"
              onClick={() => setLevel(lv.key)} // 항상 문자열로 세팅
              className={[
                "w-full rounded-2xl px-4 py-3 text-left shadow-sm transition",
                active
                  ? "bg-primary/10 text-primary ring-2 ring-primary/20"
                  : "bg-white text-slate-800 border border-slate-200 hover:border-slate-300",
              ].join(" ")}
            >
              {lv.label}
            </button>
          );
        })}
      </div>

      <p className="pt-4 text-center text-sm leading-relaxed text-slate-500">
        {msgs.map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </section>
  );
}