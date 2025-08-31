import React from "react";

export default function ConfirmModal({
  isOpen,
  mode = "confirm", // "confirm" | "alert"
  title,
  description,
  onConfirm,
  onCancel,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 text-center p-6">
        {/* 제목 */}
        {title && (
          <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        )}

        {/* 설명 */}
        {description && (
          <p className="text-gray-600 text-sm mb-6 whitespace-pre-line">
            {description}
          </p>
        )}

        {/* input/select 등 삽입 */}
        {children && <div className="mb-6">{children}</div>}

        <hr className="mb-4" />

        {/* 버튼 영역 */}
        {mode === "confirm" ? (
          <div className="flex divide-x divide-gray-300 justify-between">
            <button
              onClick={onCancel}
              className="w-1/2 py-3 rounded-l-xl text-gray-600 font-semibold hover:bg-gray-100"
            >
              아니오
            </button>
            <button
              onClick={onConfirm}
              className="w-1/2 py-3 rounded-r-xl text-purple-600 font-semibold hover:bg-purple-50"
            >
              예
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={onCancel}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}