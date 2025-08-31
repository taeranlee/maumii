// src/components/RecordButton.jsx
import { useTheme } from "../hooks/useTheme";
import EMOTIONS from "../data/Emotion";

export default function RecordButton({
  role = "me", // "me" | "partner"
  isRecording = false,
  activeRole = null, // 현재 녹음 중인 주체
  onClick,
  className = "",
  title = "",
}) {
  const { currentTheme } = useTheme();
  const isActive = isRecording && activeRole === role;

  // 항상 "차분함" emotion 선택
  const calmEmotion = EMOTIONS.find((e) => e.name === "차분함");
  const iconSrc = calmEmotion?.image?.[currentTheme];

  // 테두리 색상 매핑 (프로젝트에 맞게 조정)
  const BORDER = {
    cloud: {
      me: { active: "border-cloud-partner", inactive: "border-cloud-mine" },
      partner: {
        active: "border-cloud-partner",
        inactive: "border-cloud-partner",
      },
    },
    bear: {
      me: { active: "border-bear-partner", inactive: "border-bear-mine" },
      partner: {
        active: "border-bear-partner",
        inactive: "border-bear-partner",
      },
    },
  };
  const borderClass =
    BORDER[currentTheme]?.[role]?.[isActive ? "active" : "inactive"] ??
    "border-gray-300";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "cursor-pointer w-20 h-20 rounded-full bg-white border-4 shadow-xl flex items-center justify-center",
        borderClass,
        className,
      ].join(" ")}
    >
      <span className="w-12 h-12">
        <img
          src={iconSrc}
          alt="차분함"
          className="w-full h-full object-contain"
        />
      </span>
    </button>
  );
}
