import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Title from "../components/Title";

export default function Login() {
    const navigate = useNavigate();
    const [pw, setPw] = useState("");
    const [userId, setUserId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) {
            alert("빈 곳을 채워주세요");
            return ;
        }

        const payload = { userId, pw };
        navigate("/record", { state: payload });
    };
    return (
        <Layout>
            <Title variant="auth">로그인</Title>
            <form onSubmit={handleSubmit} className="flex-1 bg-white">
                <div className="mx-auto w-full max-w-[330px] px-6 pb-24 space-y-4">
                    <Input
                        label="아이디"
                        placeholder="아이디를 입력해 주세요"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <Input
                        label="비밀번호"
                        placeholder="비밀번호를 입력해 주세요"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                    />
                    <div className="pt-2 space-y-1">
                        <Button full type="submit">
                            로그인
                        </Button>
                        <div className="text-end text-sm text-slate-400">
                            회원가입
                        </div>
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

                    {/* 예시 버튼들 – 실제 연동 시 onClick에 핸들러 연결 */}
                    <Button full variant="outline" onClick={() => alert("Kakao 로그인")} >
                        KAKAO로 로그인
                    </Button>
                    <Button full variant="outline" onClick={() => alert("NAVER 로그인")} >
                        NAVER로 로그인
                    </Button>
                    <Button full variant="outline" onClick={() => alert("Google 로그인")} >
                        Google로 로그인
                    </Button>
                </div>
            </form>
        </Layout>
    );
}