/* ---------- 달력 Bottom Sheet 컴포넌트 ---------- */
import { useState } from "react";
export default function CalendarBottomSheet({ open, onClose, selected, setSelected }) {
    const [view, setView] = useState(() => {
        const base = selected ?? new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1); // 해당 달 1일
    });

    if (!open) return null;

    const year = view.getFullYear();
    const month = view.getMonth(); // 0~11
    const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDow; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

    const prev = () => setView(new Date(year, month - 1, 1));
    const next = () => setView(new Date(year, month + 1, 1));

    const fmtHeader = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(view);

    const isSameDay = (a, b) =>
        a && b && a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    return (
        <>
            {/* 반투명 백드롭 */}
            <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={onClose}
            />

            {/* 바텀시트 */}
            <div
                className="
          md:max-w-[390px] m-auto
          fixed inset-x-0 bottom-0 z-50
          rounded-t-[36px] bg-white
          shadow-[0_-12px_40px_rgba(0,0,0,0.12)]
          p-5
          animate-[slideUp_220ms_ease-out]
        "
                style={{ maxHeight: "70vh", overflow: "auto" }}
            >
                <style>{`
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0 }
            to   { transform: translateY(0); opacity: 1 }
          }
        `}</style>

                {/* 상단 핸들바 */}
                <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />

                {/* 헤더 */}
                <div className="mb-3 flex items-center justify-between">
                    <button
                        onClick={prev}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
                        aria-label="이전 달"
                    >
                        ‹
                    </button>
                    <div className="text-lg font-semibold">{fmtHeader}</div>
                    <button
                        onClick={next}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
                        aria-label="다음 달"
                    >
                        ›
                    </button>
                </div>

                {/* 요일 */}
                <div className="grid grid-cols-7 text-center text-slate-500 text-sm mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d} className="py-2">{d}</div>
                    ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 gap-y-2 text-center">
                    {days.map((d, idx) => {
                        if (!d) return <div key={idx} />;
                        const active = isSameDay(d, selected);
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelected(new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
                                className={[
                                    "mx-auto h-9 w-9 rounded-full text-sm",
                                    active
                                        ? "bg-violet-600 text-white shadow"
                                        : "hover:bg-slate-100"
                                ].join(" ")}
                            >
                                {d.getDate()}
                            </button>
                        );
                    })}
                </div>

                {/* 하단 여백 */}
                <div className="h-4" />
            </div>
        </>
    );
}