import React, { useState } from "react";
import Header from "../components/header";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import SectionHeader from "../components/RecordingHeader";
import Bubble from "../components/Bubble";
import { createPortal } from "react-dom";

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
        text:
          "왜냐하면 내가 쇼핑을 했는데\n진짜 잘생긴 사람이 옆에 지나갔어!!\n너도 봤었으면 좋았을 텐데 아쉽다!",
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

  // 탭바 높이가 있으면 조절 (없으면 0)
  const TABBAR_H = 84;

  return (
    <div
      className={
        (sheetOpen ? "relative h-[100svh] overflow-hidden"
                   : "relative h-[100svh] overflow-y-auto pb-24") +
        " bg-background md:max-w-[390px] md:mx-auto rounded-3xl"
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
                  <span>삭제</span>
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
                    <span className="px-2 py-1 rounded-md bg-slate-800 text-white">저장</span>
                  ) : (
                    <>
                      <FaRegEdit className="w-4 h-4 -top-[1px] relative" />
                      <span>수정</span>
                    </>
                  )}
                </button>
                <button onClick={() => setSelectMode(true)} className="text-sm text-slate-600">
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

      {/* ===== Bottom Sheet: 포털로 화면 하단 고정 + 카드 영역만 덮기 ===== */}
      {sheetOpen && editingTalk &&
        createPortal(
          <div className="fixed inset-0 z-50">
            {/* 카드 영역만 포커스 받도록 중앙에 폭 제한 */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[100svh] w-full md:max-w-[390px] pointer-events-auto">
              {/* dim: 카드 영역만 어둡게 */}
              <div
                className="absolute inset-0 rounded-3xl bg-black/40"
                onClick={() => setSheetOpen(false)}
              />
              {/* 시트: 화면 하단 고정, 탭바 높이만큼 띄움 */}
              <div
                className="absolute left-0 right-0"
                style={{ bottom: `${TABBAR_H}px` }} // 탭바 없으면 0으로
              >
                <div className="px-4 pb-4">
                  <div className="rounded-t-[40px] bg-white p-4 shadow-xl">
                    <div className="text-lg font-semibold mb-3 mt-1 text-center">
                      녹음 내용 수정하기
                    </div>
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
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
