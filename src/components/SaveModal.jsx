// src/components/SaveDialog.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SaveModal({ open, onClose, lists, onConfirm }) {
  const [mode, setMode] = useState("select");     // 'select' | 'new'
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!open) { setMode("select"); setSelectedId(null); setNewName(""); }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* 뒤배경: 천천히 페이드인/아웃 */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 패널: 아래서 '쑤욱' 올라오고 살짝 탄성 */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:w-[88%] md:max-w-sm p-5 shadow-xl"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()} // 배경 클릭만 닫히게
      >
        <div className="text-center text-lg font-semibold mb-4">녹음 파일 저장</div>

        <div className="text-sm mb-2">기록함을 선택하세요</div>

        {mode === "select" ? (
          <div className="flex gap-2">
            <select
              className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value || null)}
            >
              <option value="">새 기록함 만들기…</option>
              {lists.map((it) => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </select>
            <button className="text-sm px-3 py-2 border rounded-lg" onClick={() => setMode("new")}>
              새로
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
              placeholder="새 기록함 01"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="text-sm px-3 py-2 border rounded-lg" onClick={() => setMode("select")}>
              목록
            </button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="py-3 rounded-xl bg-gray-100" onClick={onClose}>취소</button>
          <button
            className="py-3 rounded-xl bg-gray-900 text-white"
            onClick={() => {
              const payload = mode === "select"
                ? { recordListId: selectedId ? Number(selectedId) : null, recordListTitle: null }
                : { recordListId: null, recordListTitle: newName || null };
              onConfirm(payload);
            }}
          >
            저장
          </button>
        </div>
      </motion.div>
    </div>
  );
}