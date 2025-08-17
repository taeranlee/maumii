import { Routes, Route, Link } from "react-router-dom";
import Intro from "./pages/Intro.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Mypage from "./pages/Mypage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}