import { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Title from "../components/Title";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuth } = useAuth();
  const [uId, setUId] = useState("");
  const [uPwd, setUPwd] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 이미 로그인 상태라면 원래 가려던 곳 또는 기본 페이지로 보냄
  const fromPath = location.state?.from?.pathname || "/record-list";
  if (isAuth) return <Navigate to={fromPath} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!uId || !uPwd) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      await login(uId, uPwd);   // Context의 login 함수 호출 → 세션 저장
      navigate(fromPath, { replace: true });
    } catch {
      alert("로그인 실패");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex-1 bg-white">
      <div className="m-16">
        <Title variant="auth">로그인</Title>
      </div>

      <div className="mx-auto w-full max-w-[330px] px-6 pb-24 space-y-4">
        <Input
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={uId}
          onChange={(e) => setUId(e.target.value)}
        />
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          type="password"
          value={uPwd}
          onChange={(e) => setUPwd(e.target.value)}
        />
        <div className="pt-2 space-y-1">
          <Button full type="submit">
            로그인
          </Button>
          <div className="text-end text-sm text-slate-400">회원가입</div>
        </div>

        {/* --- 옵션: 소셜 로그인 섹션 --- */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-slate-500">다른 로그인</span>
          </div>
        </div>

        <Button
          full
          variant="outline"
          onClick={() => alert("Kakao 로그인")}
        >
          KAKAO로 로그인
        </Button>
        <Button
          full
          variant="outline"
          onClick={() => alert("NAVER 로그인")}
        >
          NAVER로 로그인
        </Button>
        <Button
          full
          variant="outline"
          onClick={() => alert("Google 로그인")}
        >
          Google로 로그인
        </Button>
      </div>
    </form>
  );
}
