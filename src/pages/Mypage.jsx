export default function Mypage() {
  return (
    // 데스크톱에서만 중앙 프레임 + 회색 배경
    <div className="h-full md:grid md:place-items-center md:bg-slate-200">
      {/* 모바일: 전체 화면 / 데스크톱: 390px 프레임 */}
      <div
        className="
          fixed inset-0 w-full h-[100svh] bg-white
          flex flex-col overflow-hidden
          md:static md:h-[780px] md:max-w-[390px]
          md:rounded-2xl md:shadow-2xl md:border md:border-slate-300
        "
      >
        {/* 메인: 여기만 스크롤 */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4">
          <p className="text-center text-slate-600 mb-4">여기 메인 콘텐츠. (임시 텍스트)</p>
          <div className="h-40 rounded-2xl bg-white shadow flex items-center justify-center">카드/배너</div>
          <div className="h-80 rounded-2xl bg-white shadow flex items-center justify-center mt-4">컨텐츠1</div>
          <div className="h-80 rounded-2xl bg-white shadow flex items-center justify-center mt-4">컨텐츠2</div>
        </main>
      </div>
    </div>
  );
}