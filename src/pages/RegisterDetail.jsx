// src/pages/RegisterDetail.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Title from "../components/Title";
import Button from "../components/Button";

// (선택) 에셋이 있으면 경로 바꿔서 사용하세요.
// import cloud from "../assets/cloud.png";
// import bear from "../assets/bear.png";

const THEMES = [
  { key: "cloud", label: "구르미", emoji: "☁️" /*, img: cloud*/ },
  { key: "bear",  label: "고미",   emoji: "🐻" /*, img: bear*/  },
];

const LEVELS = [
  { key: "all",  label: "다 볼게요" },
  { key: "calm", label: "안 좋은 건 잠시 가릴게요" },
];

export default function RegisterDetail() {
  const { state } = useLocation(); // 1단계 데이터
  const navigate = useNavigate();

  const [theme, setTheme]   = useState("cloud");
  const [level, setLevel]   = useState("all");

  useEffect(() => {
    if (!state) navigate("/register", { replace: true }); // 가드
  }, [state, navigate]);

  const canSubmit = !!theme && !!level;

  const handleFinish = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const finalPayload = {
      ...state,       // name, userId, pw, phone ...
      theme,
      level,
    };
    console.log("FINAL SIGNUP:", finalPayload);
    // TODO: 서버 전송 후 이동
    // navigate("/welcome");
  };

  if (!state) return null;

  return (
      <form onSubmit={handleFinish} className="flex-1 bg-white">
        
        <Title variant="auth">회원가입</Title>

        <div className="mx-auto w-full max-w-[330px] px-5 pb-16 space-y-6">
          {/* 테마 선택 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-800">테마 선택</h2>
            <div className="grid grid-cols-2 gap-4">
              {THEMES.map((t) => {
                const active = theme === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTheme(t.key)}
                    className={[
                      "rounded-2xl border bg-white px-4 py-5 shadow-sm transition",
                      active
                        ? "border-primary/60 ring-2 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    <div className="grid place-items-center gap-3">
                      {/* 이미지 있으면 <img src={t.img} .../> 로 교체 */}
                      <div className="text-5xl">{t.emoji}</div>
                      <div className="text-base font-semibold text-slate-800">{t.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 노출 레벨 선택 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-800">노출 레벨 선택</h2>
            <div className="space-y-3">
              {LEVELS.map((lv) => {
                const active = level === lv.key;
                return (
                  <button
                    key={lv.key}
                    type="button"
                    onClick={() => setLevel(lv.key)}
                    className={[
                      "w-full rounded-2xl px-4 py-4 text-left shadow-sm transition",
                      active
                        ? "bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "bg-white text-slate-800 border border-slate-200 hover:border-slate-300"
                    ].join(" ")}
                  >
                    {lv.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 안내문 */}
          <p className="px-1 text-center text-sm leading-relaxed text-slate-500">
            비하의 목적으로 사용되는 단어는 가려집니다.
            <br />
            자극적인 말이 반복되면 마음이가 잠시 나타납니다.
          </p>

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