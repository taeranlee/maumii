import { Link } from "react-router-dom";
export default function Intro() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Intro</h1>
        <Link to="/mypage" className="text-blue-600 underline">마이페이지로 이동</Link>
      </div>
    </div>
  );
}