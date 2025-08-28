// src/pages/RegisterDetail.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import ThemeSelector from "../components/ThemeSelector";
import LevelSelector from "../components/LevelSelector";

// (선택) 에셋이 있으면 경로 바꿔서 사용하세요.
// import cloud from "../assets/cloud.png";
// import bear from "../assets/bear.png";

export default function RegisterDetail() {
  const { state } = useLocation(); // 1단계 데이터
  const navigate = useNavigate();

  const [theme, setTheme] = useState("cloud");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    if (!state) navigate("/register", { replace: true }); // 가드
  }, [state, navigate]);

  const canSubmit = !!theme && !!level;

  const handleFinish = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const finalPayload = {
      uId: state.userId,
      uName: state.name,
      uPwd: state.pw,
      uPhone: state.phone,
      uTheme: theme,
      uExposure: level === "all",
    };

    try {
      console.log("signup payload:", finalPayload);
      // axios 인스턴스(api) 없으면 fetch로 교체 ↓
      // await api.post("http://localhost:9000/api/users/signup", finalPayload);

      const res = await fetch("http://localhost:9000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("signup failed:", res.status, text);
        alert("회원가입 실패: " + res.status);
        return;
      }

      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("회원가입 실패(네트워크)");
    }
  };

  if (!state) return null;

  return (
    <form onSubmit={handleFinish} className="flex-1 bg-white">
      <div className="m-16">
        <Title variant="auth">회원가입</Title>
      </div>

      <div className="mx-auto w-full max-w-[330px] px-5 pb-16 space-y-6">
        <ThemeSelector theme={theme} setTheme={setTheme} />
        <LevelSelector level={level} setLevel={setLevel} />

        {/* 가입 버튼 */}
        <div className="pt-1">
          <Button full type="submit" disabled={!canSubmit}>
            회원가입
          </Button>
        </div>
      </div>
    </form>
  );
}
