// src/App.jsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Intro from "./pages/Intro.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Mypage from "./pages/Mypage.jsx";
import RecordList from "./pages/RecordList.jsx";
// import MyPageEdit from "./pages/MypageEdit.jsx";
import MyPageEdit from "./pages/MypageEdit.jsx";
import MyPageProtector from "./pages/MyPageProtector.jsx";
import Navigation from "./components/Navigation.jsx";
import RegisterDetail from "./pages/RegisterDetail.jsx";
import RecordDetail from "./pages/RecordDetail.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route
            path="/record"
            element={<div className="p-6">녹음 페이지</div>}
          />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/record-list" element={<RecordList />} />
          <Route path="/record-list/:id" element={<RecordDetail />} />
          <Route path="/mypage/edit" element={<MyPageEdit />} />
          <Route path="/mypage/protector" element={<MyPageProtector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>
    </Layout>
  );
}
