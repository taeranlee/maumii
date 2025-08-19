export default function ThemeSelector({theme, setTheme}) {
    const THEMES = [
        { key: "cloud", label: "구르미", emoji: "☁️" /*, img: cloud*/ },
        { key: "bear", label: "고미", emoji: "🐻" /*, img: bear*/ },
    ];

    return (
        <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-800">테마 선택</h2>
            <div className="grid grid-cols-2 gap-4">
                {THEMES.map((t) => {
                    const active = theme === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTheme(t.key)}
                            className={[
                                "rounded-2xl border bg-white px-4 py-5 shadow-sm transition",
                                active
                                    ? "border-primary/60 ring-2 ring-primary/20"
                                    : "border-slate-200 hover:border-slate-300"
                            ].join(" ")}
                        >
                            <div className="grid place-items-center py-1 gap-3">
                                {/* 이미지 있으면 <img src={t.img} .../> 로 교체 */}
                                <div className="text-5xl">{t.emoji}</div>
                                <div className="text-base font-semibold text-slate-800">{t.label}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    )
};