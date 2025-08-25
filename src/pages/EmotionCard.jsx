import { useEffect,useRef, useState } from "react";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import EMOTIONS from "../data/Emotion.js";

export default function EmotionCard({onClose}) {
  const [theme, setTheme] = useState("cloud");
  const [index, setIndex] = useState(0);
  const startX = useRef(null);

  useEffect(() => {
    // 세션에서 theme 불러오는 방법
    const savedTheme = sessionStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + EMOTIONS.length) % EMOTIONS.length);
  const next = () => setIndex((i) => (i + 1) % EMOTIONS.length);
  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const emotion = EMOTIONS[index];

  return (
    <div className="absolute inset-0 z-[60]">
      {/* 어두운 배경 (클릭 시 닫힘) */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 카드 컨테이너 */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          onClick={prev}
          className="pointer-events-auto text-white text-4xl p-2"
          aria-label="이전"
        >
          <IoIosArrowBack />
        </button>

        <div
          className="pointer-events-auto bg-white rounded-2xl w-80 max-w-[22rem] min-h-[520px] shadow-xl p-6 flex flex-col items-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={emotion.image[theme]}
            alt={emotion.name}
            className="w-32 h-32 mb-3"
          />
          <h2 className="text-2xl font-bold">{emotion.name}</h2>
          <div className="mt-4 text-center text-gray-600 space-y-1">
            {emotion.description?.map((line, i) => (
              <p key={i}>{line || "\u00A0"}</p>
            ))}
          </div>

          {/* 닫기 */}
          <button
            onClick={onClose}
            className="mt-6 rounded-full px-4 py-2 text-sm bg-black/80 text-white"
          >
            닫기
          </button>
        </div>

        <button
          onClick={next}
          className="pointer-events-auto text-white text-4xl p-2"
          aria-label="다음"
        >
          <IoIosArrowForward />
        </button>
      </motion.div>
    </div>
  );
}
