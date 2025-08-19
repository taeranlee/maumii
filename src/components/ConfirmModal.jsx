import React from "react";

export default function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  children, // ✅ 추가: input/select 같은 요소 받기
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 text-center">
        
        {/* 설명 */}
        {description && (
          <p className="text-gray-600 text-sm mt-6 mb-4">{description}</p>
        )}
        
        {/* 제목 */}
        <h2 className="text-400 font-bold mb-8">{title}</h2>

        {/* ✅ children 자리 → input/select 등 삽입 */}
        {children && <div className="mb-6">{children}</div>}

        <hr></hr>

        {/* 버튼 영역 */}
        <div className="flex divide-x divide-gray-300 justify-between">
          <button
            onClick={onCancel}
            className="w-1/2 py-4 rounded-l-xl text-400 font-semibold"
          >
            아니오
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-4 rounded-r-xl text-400 font-semibold"
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
}