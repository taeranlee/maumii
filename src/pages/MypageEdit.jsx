import Title from "../components/Title";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Button from "../components/Button";
import Input from "../components/Input";
import { api } from "../api/api"; // axios 사용 시

export default function MypageEdit() {
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");

  // 화면에서 “확인” 누른 값 (서버로 보낼 준비된 값)
  const [staged, setStaged] = useState({});
  const [loading, setLoading] = useState(false);

  const uId = localStorage.getItem("uId") || "yo"; // 임시

  const canSave = useMemo(() => Object.keys(staged).length > 0, [staged]);

  const stagePhone = () => {
    if (!phone.trim()) return;
    setStaged((prev) => ({ ...prev, uPhone: phone.trim() }));
  };

  const stagePw = () => {
    if (!pw.trim()) return;
    setStaged((prev) => ({ ...prev, uPwd: pw.trim() }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave || loading) return;

    try {
      setLoading(true);
      // PATCH /api/users/{uId}/account
      await api.patch(`/api/users/${uId}/account`, staged, {
        headers: { "Content-Type": "application/json" },
      });
      alert("저장되었습니다.");
      setStaged({});
      setPw("");
      // phone은 유지/리셋은 취향대로
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "저장에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[330px]">
      <Title
        variant="default"
        className="mt-10"
        icon={
          <Link to="/mypage">
            <FaArrowLeft className="text-lg" />
          </Link>
        }
      >
        프로필 변경
      </Title>

      <div className="grid place-items-center text-center space-y-4 p-5">
        <div
          className="w-24 h-24 shadow-[0_0px_8px_rgba(169,96,176,0.4)]"
          style={{ borderRadius: "10px" }}
        />
        <h2
          className="text-lg font-bold"
          style={{ letterSpacing: "5px", display: "inline-block" }}
        >
          김이름
        </h2>
      </div>

      <form className="overflow-y-auto h-full bg-white" onSubmit={onSubmit}>
        {/* 전화번호 */}
        <div className="flex items-end gap-2 mt-6 px-1">
          <Input
            className="flex-1"
            label="전화번호 변경하기"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={stagePhone}>
            확인
          </Button>
        </div>

        {/* 비밀번호 */}
        <div className="flex items-end gap-2 mt-6 px-1">
          <Input
            className="flex-1"
            label="비밀번호 변경하기"
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={stagePw}>
            확인
          </Button>
        </div>

        {/* 저장 예정 표시(선택) */}
        {canSave && (
          <div className="text-xs text-gray-500 mt-3 px-1">
            저장 예정:{" "}
            {[
              staged.uPhone ? "전화번호" : null,
              staged.uPwd ? "비밀번호" : null,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}

        <div className="pt-1 mt-16">
          <Button full type="submit" disabled={!canSave || loading}>
            {loading ? "저장중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
