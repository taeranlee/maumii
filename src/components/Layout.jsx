import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation.jsx"; // 경로 확인!

// src/components/Layout.jsx
export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 경로 ↔ 탭 키 매핑 (원하는 대로 수정 가능)
  const pathToKey = { "/": "record", "/record": "mic", "/mypage": "mypage" };
  const keyToPath = { record: "/", mic: "/record", mypage: "/mypage" };

  const active = pathToKey[location.pathname] ?? "record";
  const hideNav = ["/login", "/register", "/register/detail"].includes(location.pathname); // 로그인/회원가입에서 네비 숨김

  return (
    <div className="h-full md:grid md:place-items-center md:bg-slate-200">
      {/* 모바일: 전체 화면 / 데스크톱: 390px 프레임 */}
      <div
        className="
          fixed inset-0 w-full h-[100svh] bg-white
          md:relative md:h-[780px] md:max-w-[390px]
          flex flex-col overflow-hidden
          md:rounded-2xl md:shadow-2xl md:border md:border-slate-300
        "
      >
        <main className="flex-1 overflow-y-auto bg-white p-4 pb-[calc(88px+env(safe-area-inset-bottom))]">
          {children}
        </main>

        {/* 프레임 내부 하단 고정 네비 */}
        {!hideNav && (
          <div className="absolute inset-x-0 bottom-0 z-10 pb-[max(0px,env(safe-area-inset-bottom))]">
            <Navigation
              active={active}
              onChange={(key) => navigate(keyToPath[key])}
            />
          </div>
        )}

      </div>
    </div>
  );
}
