import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Title from "../components/Title";
import Collapse from "../components/Collapse";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pwMismatch = pw && pw2 && pw !== pw2;
  const canSubmit = name && userId && pw && pw2 && !pwMismatch && phone && code;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      alert("빈 곳을 채워주세요");
      return;
    }

    const payload = { name, userId, pw, phone };
    navigate("/register/detail", { state: payload });
  };
  const handleCheckDuplicate = async () => {
    const id = userId.trim();
    if (!id) {
      setMessage("아이디를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `http://localhost:9000/api/users/${encodeURIComponent(id)}`,
        {
          method: "GET",
        }
      );

      if (res.ok) {
        // 200이면 유저가 존재 ⇒ 중복
        setMessage("이미 사용 중인 아이디입니다.");
      } else if (res.status === 404) {
        // 404면 유저 없음 ⇒ 사용 가능
        setMessage("사용 가능한 아이디입니다.");
      } else {
        setMessage("서버 응답을 확인할 수 없습니다.");
      }
    } catch (e) {
      setMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleCheckDuplicate();
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto h-full bg-white">
      <div className="m-16">
        <Title variant="auth">회원가입</Title>
      </div>
      <div className="mx-auto w-full max-w-[330px] px-6 pb-24 space-y-3">
        <Input
          label="이름"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <Input
              className="flex-1"
              label="아이디"
              placeholder="아이디를 입력해 주세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckDuplicate}
              disabled={loading || !userId.trim()}
            >
              {loading ? "확인 중..." : "중복확인"}
            </Button>
          </div>
          {message && (
            <p
              aria-live="polite"
              className={`text-sm ${
                message.includes("사용 가능")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
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
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCodeInput(true)}
          >
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
            <Button type="button">확인</Button>
          </div>
        </Collapse>

        <div className="pt-2 space-y-1">
          <Button full type="submit">
            다음
          </Button>
          <div className="text-end text-sm text-slate-400">로그인</div>
        </div>
      </div>
    </form>
  );
}
