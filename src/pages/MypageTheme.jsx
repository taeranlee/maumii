import { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import ThemeSelector from "../components/ThemeSelector";
import LevelSelector from "../components/LevelSelector";

export default function MypageTheme() {
  const [theme, setTheme] = useState("cloud");
  const [level, setLevel] = useState("all");

  return (
    <div className="mx-auto w-full max-w-[330px]">
        <Title variant="default" className="mt-10" icon={<Link to="/mypage"><FaArrowLeft className="text-lg"/></Link>}>테마 변경</Title>
        <div className="px-5 py-16 space-y-6">
          <ThemeSelector theme={theme} setTheme={setTheme} />
          <LevelSelector level={level} setLevel={setLevel} />
        
          <div className="pt-1">
            <Button full>
              변경하기
            </Button>
          </div>
        </div>
    </div>
  );
}