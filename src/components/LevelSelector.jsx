export default function LevelSelector({ level, setLevel }) {
    const LEVELS = [
        { key: "all", label: "다 볼게요" },
        { key: "calm", label: "안 좋은 건 잠시 가릴게요" },
    ];

    const LEVELS_MSG = {
        all: ["욕설이나 비하의 목적으로 사용되는 단어", "모두 필터링 없이 보여줍니다."],
        calm: ["비하의 목적으로 사용되는 단어는 가려집니다.", "자극적인 말이 반복되면 마음이가 잠시 나타납니다."]
    }

    return (
        <section>
            {/* 노출 레벨 선택 */}
            <h2 className="mb-3 text-lg font-semibold text-slate-800">노출 레벨 선택</h2>
            <div className="space-y-3">
                {LEVELS.map((lv) => {
                    const active = level === lv.key;
                    return (
                        <button
                            key={lv.key}
                            type="button"
                            onClick={() => setLevel(lv.key)}
                            className={[
                                "w-full rounded-2xl px-4 py-3 text-left shadow-sm transition",
                                active
                                    ? "bg-primary/10 text-primary ring-2 ring-primary/20"
                                    : "bg-white text-slate-800 border border-slate-200 hover:border-slate-300"
                            ].join(" ")}
                        >
                            {lv.label}
                        </button>
                    );
                })}
            </div>
        

            {/* 안내문 */}
            <p className="pt-4 text-center text-sm leading-relaxed text-slate-500">
                {LEVELS_MSG[level].map((line, i) => (
                    <span key={i}>
                        {line}
                        <br />
                    </span>
                ))}
            </p>
        </section>
    );
};