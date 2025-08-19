function Bubble({ me, text, sub }) {
  const avatar = "/src/assets/images/구르미.svg"; // 곰도리 사용(구르미.svg)

  return (
    <div className={`mt-4 flex items-end gap-3 ${me ? "justify-end" : ""}`}>
      {/* 왼쪽 상대방 아바타 */}
      {!me && <img src={avatar} alt="avatar" className="h-14 w-14 shrink-0" />}

      {/* 말풍선 */}
      <div className={`max-w-[70%] ${me ? "text-left" : "text-left"}`}>
        <div
          className={[
            "rounded-2xl px-4 py-3 whitespace-pre-wrap leading-6 shadow",
            me
              ? "bg-rose-100 text-slate-800 rounded-br-md"
              : "bg-amber-100 text-slate-800 rounded-bl-md",
          ].join(" ")}
        >
          {text}
        </div>
        {sub && (
          <div className={`mt-1 text-xs text-slate-400 ${me ? "" : ""}`}>
            {sub}
          </div>
        )}
      </div>

      {/* 오른쪽 내 아바타 */}
      {me && <img src={avatar} alt="avatar" className="h-14 w-14 shrink-0" />}
    </div>
  );
}