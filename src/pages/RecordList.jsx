import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import Title from "../components/Title";
import Collapse from "../components/Collapse";
import CalendarBottomSheet from "../components/CalendarBottomSheet";
import Header from "../components/header";

export default function RecordList() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  // --- 탭 & 달력
  const [tab, setTab] = useState("recent"); // "recent" | "date"
  const [showCal, setShowCal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Date 객체 (자정 기준)

  const [records] = useState([
    {
      id: 1,
      title: "새로운 녹음",
      desc: "아르바이트 교육 관련 전달사항을 요약...",
      dateLabel: "4.10 목 오후 1:14",
      ts: "2025-04-10T13:14:00",
    },
    {
      id: 2,
      title: "이태란님과의 대화",
      desc: "우리 내일 어디서 만날지 정해야 할 것...",
      dateLabel: "4.9 수 오후 3:27",
      ts: "2025-04-09T15:27:00",
    },
    {
      id: 3,
      title: "장연정님과의 대화",
      desc: "교육 내용 중에 어려운 게 있는지 확인하...",
      dateLabel: "4.8 화 오후 2:26",
      ts: "2025-04-08T14:26:00",
    },
  ]);
  /* ---------- utils ---------- */
  function toYMD(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const isSameYMD = (a, b) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  // 표시용 리스트: 날짜 탭에서 날짜가 선택되어 있으면 그 날만, 아니면 전체
  const displayed = useMemo(() => {
    if (tab === "date" && selectedDate) {
      return records.filter((r) => isSameYMD(new Date(r.ts), selectedDate));
    }
    return records;
  }, [records, tab, selectedDate]);

  return (
    <div className="mx-auto w-full min-h-[100svh] md:min-h-[100%] bg-background">
      {/* 헤더 */}
      <Header title="녹음 기록" center={true} shadow={true} fix={true}></Header>

      {/* 탭 + 검색 */}
      <div className="pl-8 pr-6 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("recent")}
              className={`h-8 rounded-full px-4 text-sm font-medium transition ${
                tab === "recent"
                  ? "bg-button-nav text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              최근
            </button>
            <button
              onClick={() => {
                setTab("date");
                setShowCal(true);
              }}
              className={`h-8 rounded-full px-4 text-sm font-medium transition ${
                tab === "date"
                  ? "bg-button-nav text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              날짜
            </button>
          </div>

          <div className="relative flex items-center">
            {/* 동그란 검색 버튼 (닫힌 상태) */}
            {!open && (
              <button
                onClick={() => setOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white shadow-[0_0_8px_rgba(166,144,255,0.7)] hover:shadow-md transition"
                aria-label="검색"
              >
                <CiSearch className="w-5 h-5 text-slate-800" />
              </button>
            )}

            {/* 입력창 (열린 상태) — 가로로 '스윽' */}
            <Collapse show={open} axis="x" duration={400}>
              <div className="m-2 flex items-center w-30 h-9 rounded-full border border-purple-300 bg-white shadow-[0_0_8px_rgba(166,144,255,0.7)]">
                <input
                  type="text"
                  placeholder="검색어 입력"
                  className="flex-1 ml-3 text-sm outline-none"
                  autoFocus
                  onBlur={() => setOpen(false)} // 포커스 빠지면 닫힘
                />
                <CiSearch className="w-5 h-5 text-slate-800 mr-2" />
              </div>
            </Collapse>
          </div>
        </div>
      </div>

      {/* 리스트 */}
      <ul className="space-y-4 pl-2 pr-2 pb-28">
        {displayed.length === 0 && (
          <li className="px-6 py-10 text-center text-slate-400">
            선택한 날짜에 녹음이 없습니다.
          </li>
        )}

        {displayed.map((rec) => {
          const isEditing = editingId === rec.id;
          return (
            <li
              key={rec.id}
              className="rounded-[50px] bg-white p-4 pl-8 pr-5 shadow-[0_0px_5px_rgba(166,144,255,0.5)]"
            >
              <div className="flex w-full items-center gap-3 text-left">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/record-list/${rec.id}`)}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">
                      {rec.title}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {rec.dateLabel}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-slate-500">
                    {rec.desc}
                  </p>
                </div>

                <div className="relative w-10 h-10">
                  <div
                    className={`absolute inset-0 transition-opacity duration-200 ${
                      isEditing
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    <button
                      onClick={() => setEditingId(rec.id)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-button-edit shadow-inner"
                      title="이름 변경"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
                        <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25Zm17.71-10.96a1 1 0 0 0 0-1.41l-2.59-2.59a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 2.08-1.58Z" />
                      </svg>
                    </button>
                  </div>

                  <div
                    className={`absolute inset-0 transition-opacity duration-200 ${
                      isEditing
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <button
                      onClick={() => setEditingId(null)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-rose-500 shadow-inner"
                      title="삭제"
                    >
                      <FaRegTrashAlt className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {/* 날짜 탭일 때 달력 Bottom Sheet */}
      <CalendarBottomSheet
        open={tab === "date" && showCal}
        onClose={() => setShowCal(false)}
        selected={selectedDate}
        setSelected={(d) => {
          setSelectedDate(d);
          setShowCal(false);
        }}
      />
    </div>
  );
}
