import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { HiPlay } from "react-icons/hi2";

// 샘플 데이터 (원하면 외부 mock에서 가져와도 OK)
const sampleSections = [
  {
    header: { dateLabel: "4.7 월 오후 11:07", duration: "11분 52초" },
    talks: [
      { id: 1, me: true,  text: "나 어제 진짜 기분 좋았어~~",   sub: "0.0초" },
      { id: 2, me: false, text: "왜 기분이 좋았어?",              sub: "5.6초" },
      {
        id: 3,
        me: true,
        text: "왜냐하면 내가 쇼핑을 했는데\n진짜 잘생긴 사람이 옆에 지나갔어!!\n너도 봤었으면 좋았을 텐데 아쉽다!",
        sub: "6분",
      },
      { id: 4, me: false, text: "와 진짜 화난다 너만 본거야?", sub: "10분" },
    ],
  },
  {
    header: { dateLabel: "4.10 목 오후 1:14", duration: "21분 48초" },
    talks: [
      {
        id: 5,
        me: true,
        text: "나 진짜 너 때문에 너무 화난다\n왜 그렇게 내 말을 안들어",
      },
    ],
  },
];

// 왼/오 말풍선 하나
function Bubble({ me, text, sub }) {
  const avatar = "/src/assets/images/구르미.svg"; // 곰도리 사용(구르미.svg)

  return (
    <div className={`mt-4 flex items-end gap-3 ${me ? "justify-end" : ""}`}>
      {/* 왼쪽 상대방 아바타 */}
      {!me && (
        <img
          src={avatar}
          alt="avatar"
          className="h-14 w-14 shrink-0"
        />
      )}

      {/* 말풍선 */}
      <div className={`max-w-[70%] ${me ? "text-right" : "text-left"}`}>
        <div
          className={[
            "rounded-2xl px-4 py-3 whitespace-pre-wrap leading-6 shadow",
            me ? "bg-rose-100 text-slate-800 rounded-br-md" : "bg-amber-100 text-slate-800 rounded-bl-md",
          ].join(" ")}
        >
          {text}
        </div>
        {sub && (
          <div className={`mt-1 text-xs text-slate-400 ${me ? "" : ""}`}>{sub}</div>
        )}
      </div>

      {/* 오른쪽 내 아바타 */}
      {me && (
        <img
          src={avatar}
          alt="avatar"
          className="h-14 w-14 shrink-0"
        />
      )}
    </div>
  );
}

// 섹션 헤더(날짜/시간 + 재생 영역)
function SectionHeader({ dateLabel, duration }) {
  return (
    <div className="mt-6 mb-3">
      <div className="flex items-center gap-3 px-1">
        <div className="text-slate-700 font-semibold">{dateLabel}</div>
        <button className="grid h-8 w-8 place-items-center rounded-full bg-white shadow">
          <HiPlay className="text-indigo-600 w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 px-1">
        <input
          type="range"
          min="0"
          max="100"
          className="w-full accent-indigo-500"
          readOnly
        />
        <div className="text-slate-500 text-sm">{duration}</div>
      </div>
    </div>
  );
}

export default function RecordDetail() {
  const { id } = useParams(); // 필요시 이 id로 mock/서버 데이터 조회
  const sections = useMemo(() => sampleSections, []);

  return (
    <div className="overflow-y-auto h-full min-h-[100svh] bg-slate-100 md:max-w-[390px] md:mx-auto">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-10 bg-white rounded-b-3xl shadow px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">이태란님과의 대화</div>
          <div className="text-indigo-600 text-sm font-medium">선택</div>
        </div>
      </div>

      {/* 내용 */}
      <div className="px-4 pb-24">
        {sections.map((sec, i) => (
          <div key={i}>
            <SectionHeader {...sec.header} />
            <div className="rounded-3xl bg-white/70 p-4 shadow-sm">
              {sec.talks.map((t) => (
                <Bubble key={t.id} me={t.me} text={t.text} sub={t.sub} />
              ))}
            </div>

            {/* 섹션 구분선 */}
            <div className="my-6 h-px w-full bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}