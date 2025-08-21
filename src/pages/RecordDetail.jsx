import React, { useState } from "react";
import Header from "../components/header";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import SectionHeader from "../components/RecordingHeader";
import Bubble from "../components/Bubble";
import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";

// 샘플 데이터
const sampleSections = [
  {
    id: "s1",
    header: { dateLabel: "4.7 월 오후 11:07", duration: "11분 52초" },
    talks: [
      { id: 1, me: true, text: "나 어제 진짜 기분 좋았어~~", sub: "0.0초" },
      { id: 2, me: false, text: "왜 기분이 좋았어?", sub: "5.6초" },
      {
        id: 3,
        me: true,
        text: "왜냐하면 내가 쇼핑을 했는데\n진짜 잘생긴 사람이 옆에 지나갔어!!\n너도 봤었으면 좋았을 텐데 아쉽다!",
        sub: "6분",
      },
      { id: 4, me: false, text: "와 진짜 화난다 너만 본거야?", sub: "10분" },
    ],
  },
  {
    id: "s2",
    header: { dateLabel: "4.10 목 오후 1:14", duration: "21분 48초" },
    talks: [
      {
        id: 5,
        me: true,
        text: "나 진짜 너 때문에 너무 화난다\n왜 그렇게 내 말을 안들어",
        sub: "1분",
      },
    ],
  },
];

export default function RecordDetail() {
  // 제목 수정
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("이태란님과의 대화");

  // 섹션 선택/삭제
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);

  // 말풍선 편집 시트
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState(null); // { sectionId, talkId, text }

  // 데이터
  const [sections, setSections] = useState(sampleSections);

  const canvasRef = useRef(null);

  const toggleSection = (sid) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const handleDeleteSections = () => {
    if (selectedSectionIds.length === 0) return;
    setSections((prev) =>
      prev.filter((s) => !selectedSectionIds.includes(s.id))
    );
    setSelectedSectionIds([]);
    setSelectMode(false);
  };

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
                t.id === editingTalk.talkId
                  ? { ...t, text: editingTalk.text }
                  : t
              ),
            }
      )
    );
    setSheetOpen(false);
    setEditingTalk(null);
  };

  useEffect(() => {
    if (!sheetOpen) return;

    const prev = {
      overflow: document.body.style.overflow,
      touchAction: document.body.style.touchAction,
    };
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none"; // iOS에서 튕김 방지

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.touchAction = prev.touchAction;
    };
  }, [sheetOpen]);

  // 탭바 높이가 있으면 조절 (없으면 0)
  const TABBAR_H = 100;

  return (
    <div
      ref={canvasRef}
      className={
        "relative w-full bg-background " +
        (sheetOpen
          ? "overflow-hidden overscroll-none"
          : "overflow-y-auto pb-24") +
        // ▼ 모바일: dvh, 데스크탑: svh + 중앙 정렬/라운드
        " h-[111dvh] md:h-[100svh] md:max-w-[390px] md:mx-auto md:rounded-xl"
      }
    >
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
        {sections.map((sec) => {
          const checked = selectedSectionIds.includes(sec.id);
          return (
            <div key={sec.id} className="relative">
              <div className="relative">
                <SectionHeader {...sec.header} />
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
                {sec.talks.map((t) => (
                  <div key={t.id}>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (selectMode) return;
                        openEditTalk(sec.id, t.id, t.text);
                      }}
                    >
                      <Bubble me={t.me} text={t.text} sub={t.sub} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px w-full bg-slate-200" />
            </div>
          );
        })}
      </div>

      {/* ===== Bottom Sheet: 포털로 화면 하단 고정 ===== */}
      {sheetOpen &&
        editingTalk &&
        canvasRef.current &&
        createPortal(
          <div className="absolute inset-0 z-50">
            {/* dim: 레이아웃 영역만 어둡게 (모서리 맞춤) */}
            <div
              className="absolute inset-0 bg-black/40 rounded-3xl"
              onClick={() => setSheetOpen(false)}
            />

            {/* 시트: 레이아웃 하단에 붙이기 (래퍼 기준) */}
            <div
              className="fixed left-1/2 -translate-x-1/2 md:translate-y-12 translate-y-[98px] w-full md:max-w-[390px] pointer-events-none"
              style={{
                bottom: `calc(${TABBAR_H}px)`,
              }}
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
          canvasRef.current // ★ document.body 대신 레이아웃 노드
        )}
    </div>
  );
}
