import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Title from "../components/Title";
import Collapse from "../components/Collapse"

export default function Register() {
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);

    const pwMismatch = pw && pw2 && pw !== pw2;
    const canSubmit = name && userId && pw && pw2 && !pwMismatch && phone && code;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        console.log({ name, userId, pw, pw2, phone, code });
    };
    
    return (
    <Layout>
        <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto bg-white"
        >
        <Title variant="auth">회원가입</Title>
        <div className="mx-auto w-full max-w-[330px] px-6 pb-24 space-y-4">
            <Input
                label="이름"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="flex items-end gap-2">
                <Input
                className="flex-1"
                label="아이디"
                placeholder="아이디를 입력해 주세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                />
                <Button variant="outline">중복확인</Button>
            </div>

            <Input
                label="비밀번호"
                type="password"
                placeholder="비밀번호"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
            />

            <Input
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호 확인"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                error={pwMismatch ? "비밀번호가 일치하지 않습니다." : ""}
            />

            {/* 전화번호 + 인증하기 */}
            <div className="flex items-end gap-2">
                <Input
                className="flex-1"
                label="전화번호"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                />
                <Button variant="outline" onClick={() => setShowCodeInput(true)}>
                    인증하기
                </Button>
            </div>

            {/* 인증번호 입력창 (조건부 렌더링) */}
            <Collapse show={showCodeInput} duration={350}>
                <div className="flex items-end gap-2">
                <Input
                    className="flex-1"
                    label="인증번호"
                    placeholder="6자리"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button>확인</Button>
                </div>
            </Collapse>

            <div className="pt-2 space-y-2">
                <Button full type="submit">
                    다음
                </Button>
                <div className="text-end text-sm text-slate-400">
                    로그인
                </div>
            </div>
        </div>
    </form>
        
    </Layout>
  );
}