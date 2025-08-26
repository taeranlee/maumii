import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import EMOTIONS from "../data/Emotion.js";
import { motion, useAnimation } from "framer-motion";

export default function EmotionCard({onClose}) {
  const [theme, setTheme] = useState("cloud");
  const [index, setIndex] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    // 세션에서 theme 불러오는 방법
    const savedTheme = sessionStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  //기본 넘기기
  // const prev = () => setIndex((i) => (i - 1 + EMOTIONS.length) % EMOTIONS.length);
  // const next = () => setIndex((i) => (i + 1) % EMOTIONS.length);
  
  // 이건 키보드 이벤트 핸들러
  // useEffect(() => {
  //   const onKey = (e) => {
  //     if (e.key === "ArrowLeft") prev();
  //     if (e.key === "ArrowRight") next();
  //     if (e.key === "Escape") onClose?.();
  //   };
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, []);

  const len = EMOTIONS.length;

  const flipNext = async () => {
    // 앞면(0deg) → 뒷면(180deg)
    await controls.start({ rotateY: 180, transition: { duration: 0.35, ease: "easeInOut" } });
    // 180deg 시점에서 다음 카드로 교체
    setIndex((i) => (i + 1) % len);
    // 뒷면(180deg) → 다음 카드 앞면(360deg)
    await controls.start({ rotateY: 360, transition: { duration: 0.35, ease: "easeInOut" } });
    // 회전 각도 0으로 리셋 (360deg == 0deg, 눈에 안 보이게 즉시 세팅)
    controls.set({ rotateY: 0 });
  };

  const flipPrev = async () => {
    await controls.start({ rotateY: -180, transition: { duration: 0.35, ease: "easeInOut" } });
    setIndex((i) => (i - 1 + len) % len);
    await controls.start({ rotateY: -360, transition: { duration: 0.35, ease: "easeInOut" } });
    controls.set({ rotateY: 0 });
  };

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
        className="absolute inset-0 pointer-events-none flex items-center justify-center gap-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          onClick={flipPrev}
          className="pointer-events-auto text-[#F9E000] text-4xl md:p-0 p-2"
          aria-label="이전"
        >
          <IoIosArrowBack />
        </button>

        {/* <div
          className="pointer-events-auto bg-white rounded-2xl w-[330px] max-w-[22rem] 
          min-h-[550px] shadow-xl p-6 flex flex-col items-center"
        >
          <img
            src={emotion.image[theme]}
            alt={emotion.name}
            className="w-50 h-50 mt-7"
          />
          <h2 className="mt-10 mb-5 text-4xl font-bold">{emotion.name}</h2>
          <div className="mt-4 text-center text-gray-600 space-y-1 break-words">
            {emotion.description?.map((line, i) => (
              <p key={i}>{line || "\u00A0"}</p>
            ))}
          </div>
        </div> */}

        <div style={{ perspective: 1000 }}>
          {/* 회전하는 카드 컨테이너 */}
          <motion.div
            animate={controls}
            style={{ transformStyle: "preserve-3d" }}
            className="w-[320px] md:w-70 max-w-[22rem] min-h-[550px] relative"
          >
            {/* 앞면 */}
            <div
              className="absolute inset-0 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
            >
              <img src={emotion.image[theme]} alt={emotion.name} className="w-[230px] h-[230px] mb-3 mt-10" />
              <h2 className="text-4xl font-bold mt-7">{emotion.name}</h2>
              <div className="mt-4 text-center text-400 space-y-1 whitespace-pre-line">
                {emotion.description?.map((line, i) => (
                  <p key={i}>{line || "\u00A0"}</p>
                ))}
              </div>
            </div>

            {/* 뒷면 (디자인은 원하는대로 꾸미기) */}
            <div
              className="absolute inset-0 rounded-2xl shadow-xl p-6 flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,.3), rgba(255,255,255,0) 40%), linear-gradient(135deg, #6D65F8 0%, #A690FF 50%, #6C51C7 100%)",
                color: "white",
                border: "1px solid rgba(255,255,255,.25)",
              }}
            >
              <div className="text-center">
                <div className="text-sm opacity-80 mb-2">MAUMI COLLECTION</div>
                <div className="text-3xl font-extrabold tracking-widest">EMOTION</div>
                <div className="mt-2 text-xs opacity-80">Swipe or click →</div>
              </div>
            </div>
          </motion.div>
        </div>

        <button
          onClick={flipNext}
          className="pointer-events-auto text-[#F9E000] text-4xl md:p-0 p-2"
          aria-label="다음"
        >
          <IoIosArrowForward />
        </button>
      </motion.div>
    </div>
  );
}
