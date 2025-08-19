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