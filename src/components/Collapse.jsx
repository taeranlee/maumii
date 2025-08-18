// 높이 자동(auto) 애니메이션: grid-rows 0fr ↔ 1fr 트릭
export default function Collapse({ show, duration = 300, children }) {
  return (
    <div
      className={`grid transition-all ease-out ${show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} `}
      style={{ transitionDuration: `${duration}ms` }}
    >
      <div className="overflow-y-hidden">
        {children}
      </div>
    </div>
  );
}