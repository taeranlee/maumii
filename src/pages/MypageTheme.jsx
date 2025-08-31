import { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import ThemeSelector from "../components/ThemeSelector";
import LevelSelector from "../components/LevelSelector";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function MypageTheme() {
  const [theme, setTheme] = useState("cloud");
  const [level, setLevel] = useState("all");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // 사용자 정보에서 현재 테마와 노출범위 가져오기
  useEffect(() => {
    if (user) {
      setTheme(user.uTheme || "cloud");
      setLevel(user.uExposure ? "all" : "calm");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user?.uId) {
      alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    // 변경사항이 없으면 저장하지 않음
    const currentTheme = user.uTheme || "cloud";
    const currentExposure = user.uExposure ? "all" : "calm";

    if (currentTheme === theme && currentExposure === level) {
      alert("변경사항이 없습니다.");
      return;
    }

    try {
      setLoading(true);

      // PUT /api/users/{uId}/preference - 컨트롤러와 일치
      const requestData = {
        uTheme: theme,
        uExposure: level === "all", // "all"이면 true, "protector"면 false
      };

      await api.put(`/api/users/${user.uId}/preference`, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("테마 설정이 저장되었습니다.");

      // 페이지 새로고침으로 업데이트된 정보 반영
      window.location.reload();
    } catch (err) {
      console.error("테마 설정 업데이트 실패:", err);

      // 에러 메시지 처리
      let errorMessage = "저장에 실패했습니다.";

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.status === 404) {
        errorMessage = "사용자를 찾을 수 없습니다.";
      } else if (err?.response?.status === 400) {
        errorMessage = "입력 정보를 확인해주세요.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 로그인하지 않은 사용자 처리
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[330px]">
        <Title variant="default" className="mt-10">
          테마 변경
        </Title>
        <div className="text-center mt-20">
          <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
          <Link to="/login">
            <Button>로그인하러 가기</Button>
          </Link>
        </div>
      </div>
    );
  }

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
        테마 변경
      </Title>

      <div className="px-5 py-16 space-y-6">
        <ThemeSelector theme={theme} setTheme={setTheme} />
        <LevelSelector level={level} setLevel={setLevel} />

        <div className="pt-1">
          <Button full onClick={handleSubmit} disabled={loading}>
            {loading ? "저장중..." : "변경하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
