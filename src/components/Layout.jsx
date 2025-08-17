// src/components/Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="h-full md:grid md:place-items-center md:bg-slate-200">
      {/* 모바일: 전체 화면 / 데스크톱: 390px 프레임 */}
      <div
        className="
          fixed inset-0 w-full h-[100svh] bg-white relative
          flex flex-col overflow-hidden
          md:static md:h-[780px] md:max-w-[390px]
          md:rounded-2xl md:shadow-2xl md:border md:border-slate-300
        "
      >
        {children}
      </div>
    </div>
  );
}