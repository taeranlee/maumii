import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/header";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import SectionHeader from "../components/RecordingHeader";
import Bubble from "../components/Bubble";
import { createPortal } from "react-dom";

/** ▼ 헬퍼들 */
// ✅ LDT(타임존 없음)도, ISO(타임존 포함)도 안전하게 파싱
const parseLocalDateTime = (s) => {
  if (!s) return null;
  if (s instanceof Date) return isNaN(s) ? null : s;

  // 1) "yyyy-MM-ddTHH:mm:ss[.SSS]"  (타임존 없음)
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(s);
  if (m) {
    const [, Y, M, D, h, mi, se = "0", ms = "0"] = m;
    return new Date(+Y, +M - 1, +D, +h, +mi, +se, +`${ms}`.padEnd(3, "0"));
  }

  // 2) 그 외 문자열은 브라우저 파서에 맡김 (ISO with Z/+09:00 등)
  const d = new Date(s);
  return isNaN(d) ? null : d;
};

const fmtStartLabel = (ms) => {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 1) return `${m}분 ${s}초`;      // 1분 이상이면 "m분 s초"
  return `${(ms / 1000).toFixed(1)}초`;    // 1분 미만이면 소수1자리 초
};

const fmtDateLabel = (s) => {
  const d = parseLocalDateTime(s);
  if (!d) return "-";

  const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  const h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const hh = (h % 12) || 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}.${d.getDate()} ${dow} ${ampm} ${hh}:${mm}`;
};

// "HH:mm:ss" | "HH:mm:ss.SSS" | number(ms) | null 모두 OK
const toMsFromLocalTime = (t) => {
  if (!t && t !== 0) return 0;
  if (typeof t === "number") return t;

  const m = /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/.exec(t);
  if (!m) return 0;
  const [, hh, mm, ss, ms = "0"] = m;
  return ((+hh) * 3600 + (+mm) * 60 + (+ss)) * 1000 + +`${ms}`.padEnd(3, "0");
};

const fmtDurationKorean = (ms) => {
  const sec = Math.floor((ms || 0) / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}시간 ${m}분 ${s}초`;
  if (m) return `${m}분 ${s}초`;
  return `${s}초`;
};

export default function RecordDetail({ rlId = 5, userId = "null" }) {
  // 제목 수정
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("대화 기록");

  // 섹션 선택/삭제
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);

  // 말풍선 편집 시트
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState(null); // { sectionId, talkId, text }

  // ✅ 서버에서 불러온 섹션들
  const [sections, setSections] = useState([]); // [{id, header, talks, rVoice}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 오디오 재생기 (공용 1개)
  const audioRef = useRef(null);

  /** ▼ 데이터 로딩 */
  useEffect(() => {
  (async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:9000/api/record-lists/${rlId}/records?userId=${encodeURIComponent(userId)}`;
      console.log("[RecordDetail] fetch:", url);
      const res = await fetch(url);

      // ❗ HTTP 에러를 즉시 드러내기
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
      }

      const data = await res.json();
      console.log("[RecordDetail] response JSON:", data);

      if (Array.isArray(data) && data.length > 0 && data[0].rlName) {
        setTitle(data[0].rlName);
      }

      // 기대 스키마: [{ rId, rCreatedAt, rLength, rVoice, bubbles?: [...] }, ...]
      const mapped = (Array.isArray(data) ? data : []).map((rec) => {
        const totalMs =
          typeof rec.rLength === "string"
            ? toMsFromLocalTime(rec.rLength)
            : (rec.totalMs ?? 0);

        let cursorMs = 0;
        const talks = (rec.bubbles || []).map((b, idx) => {
          const lenMs =
            b?.durationMs ??
            (typeof b?.bLength === "string" ? toMsFromLocalTime(b.bLength) : 0);

          const startLabel = fmtStartLabel(cursorMs);

          const talk = {
            id: idx + 1,
            me: (b?.bTalker || "").toLowerCase() === "me",
            text: b?.bText || "",
            sub: startLabel,
            startMs: cursorMs,
            endMs: cursorMs + Math.max(0, lenMs),
          };
          cursorMs += Math.max(0, lenMs);
          return talk;
        });

        // rVoice 경로 정규화: /voices/** 또는 /media/** 만 들어오도록 백엔드와 합의했죠?
        const voice = rec.rVoice || "";
        if (!voice.startsWith("/voices/") && !voice.startsWith("/media/")) {
          console.warn("[RecordDetail] rVoice looks odd:", voice);
        }

        return {
          id: `rec-${rec.rId}`,
          rId: rec.rId,
          rVoice: voice, // 예: "/voices/uuid.ogg" 또는 "/media/voices/uuid.ogg"
          header: {
            dateLabel: fmtDateLabel(rec.rCreatedAt),
            duration: fmtDurationKorean(totalMs),
          },
          talks,
        };
      });

      console.log("[RecordDetail] mapped sections:", mapped);
      setSections(mapped);
    } catch (e) {
      console.error("[RecordDetail] load records failed:", e);
      setError(String(e?.message || e));
      setSections([]);
    } finally {
      setLoading(false);
    }
  })();
}, [rlId, userId]);

  /** ▼ 섹션 선택/삭제 */
  const toggleSection = (sid) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };
  const handleDeleteSections = () => {
    if (selectedSectionIds.length === 0) return;
    setSections((prev) => prev.filter((s) => !selectedSectionIds.includes(s.id)));
    setSelectedSectionIds([]);
    setSelectMode(false);
  };

  /** ▼ 말풍선 편집 */
  const openEditTalk = (sectionId, talkId, currentText) => {
    setEditingTalk({ sectionId, talkId, text: currentText });
    setSheetOpen(true);
  };
  const saveTalkText = () => {
    if (!editingTalk) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id !== editingTalk.sectionId
          ? s
          : {
              ...s,
              talks: s.talks.map((t) =>
                t.id === editingTalk.talkId ? { ...t, text: editingTalk.text } : t
              ),
            }
      )
    );
    setSheetOpen(false);
    setEditingTalk(null);
  };

  /** ▼ 바텀시트 열릴 때 스크롤 잠금 */
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = {
      overflow: document.body.style.overflow,
      touchAction: document.body.style.touchAction,
    };
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.touchAction = prev.touchAction;
    };
  }, [sheetOpen]);

  const [activeRecId, setActiveRecId] = useState(null);
 const [progress, setProgress] = useState(0);       // 0~1
 const [durationSec, setDurationSec] = useState(0); // 숫자(초)

useEffect(() => {
  const a = audioRef.current;
  if (!a) return;
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onEnded = () => setIsPlaying(false);

  a.addEventListener("play", onPlay);
  a.addEventListener("pause", onPause);
  a.addEventListener("ended", onEnded);

  return () => {
    a.removeEventListener("play", onPlay);
    a.removeEventListener("pause", onPause);
    a.removeEventListener("ended", onEnded);
  };
}, []);

 // raf 루프
 useEffect(() => {
   const a = audioRef.current;
   if (!a) return;
   let raf;
   const tick = () => {
     if (a.duration > 0) {
       setDurationSec(a.duration);
       setProgress(a.currentTime / a.duration);
     }
     raf = requestAnimationFrame(tick);
   };
   raf = requestAnimationFrame(tick);
   return () => cancelAnimationFrame(raf);
 }, []);

  const absUrl = (u) => (u?.startsWith("/") ? `http://localhost:9000${u}` : u || "");

  /** ▼ 재생 제어: 섹션 헤더의 Play 버튼에서 호출 */
const playSection = (section) => {
  const a = audioRef.current;
  if (!a || !section?.rVoice) return;
  const src = absUrl(section.rVoice);

  // 같은 섹션이면 토글
  if (section.rId === activeRecId && a.src === src) {
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(()=>{});
    } else {
      a.pause();
      setIsPlaying(false);
    }
    return;
  }

  // 다른 섹션으로 변경
  a.src = src;
  a.currentTime = 0;
  setActiveRecId(section.rId);
  a.play().then(() => setIsPlaying(true)).catch(()=>{});
};
const getSectionProgress = (sec) => (sec.rId === activeRecId ? progress : 0);

// 사용자가 바를 드래그했을 때 점프
 const seekSection = (sec, ratio) => {
   const a = audioRef.current;
   if (!a || sec.rId !== activeRecId || !Number.isFinite(a.duration)) return;
   a.currentTime = Math.max(0, Math.min(1, ratio)) * a.duration;
 };

  /** ▼ 탭바 높이 */
  const TABBAR_H = 100;

  return (
    <div
      className={
        "relative w-full bg-background " +
        (sheetOpen ? "overflow-hidden overscroll-none" : "overflow-y-auto pb-24") +
        " h-[111dvh] md:h-[100svh] md:max-w-[390px] md:mx-auto md:rounded-xl"
      }
    >
      {/* 공용 오디오(숨김) */}
      <audio ref={audioRef} className="hidden" />

      {/* HEADER */}
      <Header
        title={
          isEditingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent outline-none border-b border-slate-300 text-base"
            />
          ) : (
            title
          )
        }
        rightSlot={
          <div className="flex items-center gap-2">
            {selectMode ? (
              <>
                <button
                  onClick={handleDeleteSections}
                  className="flex items-center gap-1 text-sm text-red-600"
                >
                  <FiTrash2 className="w-4 h-4 -top-[1px] relative" />
                </button>
                <button
                  onClick={() => {
                    setSelectMode(false);
                    setSelectedSectionIds([]);
                  }}
                  className="text-sm text-slate-600"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditingTitle((v) => !v)}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  {isEditingTitle ? (
                    <span className="px-2 py-1 rounded-md bg-button-edit text-white">
                      저장
                    </span>
                  ) : (
                    <>
                      <FaRegEdit className="w-4 h-4 -top-[1px] relative" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectMode(true)}
                  className="text-sm text-slate-600"
                >
                  선택
                </button>
              </>
            )}
          </div>
        }
      />

      {/* CONTENT */}
      <div className="px-4 pb-24">
        {loading && (
          <div className="py-8 text-center text-slate-500">불러오는 중…</div>
        )}

        {!loading && sections.length === 0 && (
          <div className="py-8 text-center text-slate-500">기록이 없습니다.</div>
        )}

        {sections.map((sec) => {
          const checked = selectedSectionIds.includes(sec.id);
          return (
            <div key={sec.id} className="relative">
              <div className="relative">
                {/* ✅ SectionHeader의 onPlay에 넘겨서 rVoice 재생 */}
                <SectionHeader
                  {...sec.header}
                  onPlay={() => playSection(sec)}
                  progress={getSectionProgress(sec)}
                  onSeek={(r) => seekSection(sec, r)}
                  isActive={sec.rId === activeRecId}   // ✅ 현재 재생중인 섹션인지
                  isPlaying={isPlaying}                // ✅ 오디오가 재생중인지
                />
                {selectMode && (
                  <label className="absolute right-1 top-2 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSection(sec.id)}
                      className="accent-purple-600 w-4 h-4"
                    />
                  </label>
                )}
              </div>

              <div className="bg-white rounded-3xl pt-1 pb-3 px-3">
              {sec.talks.map((t) => {
                const a = audioRef.current;
                const isActive =
                  sec.rId === activeRecId &&
                  a &&
                  a.currentTime * 1000 >= t.startMs &&
                  a.currentTime * 1000 < t.endMs;

                return (
                  <div key={t.id}>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (selectMode) return;
                        openEditTalk(sec.id, t.id, t.text);
                      }}
                    >
                      <Bubble me={t.me} text={t.text} sub={t.sub} isActive={isActive} />
                    </button>
                  </div>
                );
              })}
            </div>

              <div className="my-6 h-px w-full bg-slate-200" />
            </div>
          );
        })}
      </div>

      {/* ===== Bottom Sheet ===== */}
      {sheetOpen &&
        editingTalk &&
        createPortal(
          <div className="absolute inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40 rounded-3xl"
              onClick={() => setSheetOpen(false)}
            />

            <div
              className="fixed left-1/2 -translate-x-1/2 md:translate-y-12 translate-y-[98px] w-full md:max-w-[390px] pointer-events-none"
              style={{ bottom: `calc(${TABBAR_H}px)` }}
            >
              <div className="pointer-events-auto w-full rounded-b-2xl rounded-t-[40px] bg-white shadow-xl">
                <div className="text-lg font-semibold mb-3 mt-3 py-6 text-center">
                  녹음 내용 수정하기
                </div>

                <div className="px-4 pb-4">
                  <textarea
                    className="w-full min-h-[140px] rounded-xl border border-slate-200 p-3 outline-none"
                    value={editingTalk.text}
                    onChange={(e) =>
                      setEditingTalk((prev) =>
                        prev ? { ...prev, text: e.target.value } : prev
                      )
                    }
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      className="px-4 py-2 rounded-xl border border-slate-300"
                      onClick={() => {
                        setSheetOpen(false);
                        setEditingTalk(null);
                      }}
                    >
                      취소
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white"
                      onClick={saveTalkText}
                    >
                      저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          // 포털은 바깥 문서가 아니라 현재 레이아웃에 붙여도 됨
          document.body
        )}
    </div>
  );
}