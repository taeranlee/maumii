// src/App.jsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Intro from "./pages/Intro.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Mypage from "./pages/Mypage.jsx";
import Navigation from "./components/Navigation.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // 경로 ↔ 탭 키 매핑 (필요에 맞게 수정 가능)
  const pathToKey = {
    "/": "record",
    "/record": "mic",
    "/mypage": "mypage",
  };
  const keyToPath = {
    record: "/",
    mic: "/record",
    mypage: "/mypage",
  };

  const active = pathToKey[location.pathname] ?? "record";
  const hideNav = ["/login", "/register"].includes(location.pathname); // 로그인/회원가입에서 숨김

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 pb-[calc(88px+env(safe-area-inset-bottom))]">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route
            path="/record"
            element={<div className="p-6">녹음 페이지</div>}
          />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>

        {!hideNav && (
          <div className="absolute inset-x-4 bottom-4">
            <Navigation
              active={active}
              onChange={(key) => navigate(keyToPath[key])}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
