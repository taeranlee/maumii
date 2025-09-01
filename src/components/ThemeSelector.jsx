import cloudCalm from '../assets/images/emotion/cloud_calm.png';
import bearCalm from '../assets/images/emotion/bear_calm.png';

export default function ThemeSelector({theme, setTheme}) {
    const THEMES = [
        { key: "cloud", label: "구르미", emoji: "☁️" , img: cloudCalm },
        { key: "bear", label: "고미", emoji: "🐻" , img: bearCalm },
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
                                {/* <div className="text-5xl">{t.emoji}</div> */}
                                <img src={t.img} className="w-20" />
                                <div className="text-base font-semibold text-slate-800">{t.label}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    )
};