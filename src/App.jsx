// src/App.jsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Intro from "./pages/Intro.jsx";
import Register from "./pages/Register.jsx";
import RegisterDetail from "./pages/RegisterDetail.jsx";
import Login from "./pages/Login.jsx";
import Navigation from "./components/Navigation.jsx";
import Mypage from "./pages/Mypage.jsx";
import MypageEdit from "./pages/MypageEdit.jsx";
import Protector from "./pages/Protector.jsx"
import MypageTheme from "./pages/MypageTheme.jsx";
import Record from "./pages/Record.jsx";
import RecordList from "./pages/RecordList.jsx";
import RecordDetail from "./pages/RecordDetail.jsx";
import Emotion from "./pages/EmotionCard.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/detail" element={<RegisterDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/edit" element={<MypageEdit />} />
          <Route path="/mypage/protector" element={<Protector />} />
          <Route path="/mypage/theme" element={<MypageTheme />} />
          <Route path="/record" element={<Record />} />
          <Route path="/record-list" element={<RecordList />} />
          <Route path="/record-list/:rlId" element={<RecordDetail />} />
          <Route path="/emotion" element={<Emotion />} />
        </Routes>
    </Layout>
  );
}
