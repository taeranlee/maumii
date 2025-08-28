import { useEffect, useRef, useState } from "react";
import { FaBook } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import HelpScreen from "./HelpScreen";
import EmotionCard from "./EmotionCard";
import SaveDialog from "../components/SaveModal";

const emotionImgs = import.meta.glob("../assets/images/cloud_*.png", {
  eager: true,
  import: "default",
});
const defaultHero = new URL("../assets/images/cloud_calm.png", import.meta.url).href;

function getEmotionImg(label) {
  if (!label) return defaultHero;
  const key = `../assets/images/cloud_${label}.png`;
  return emotionImgs[key] ?? defaultHero;
}

const debugForm = async (form) => {
  const blob = form.get("record");  // Blob(application/json)
  console.log("record blob:", blob);

  if (blob) {
    const txt = await blob.text();  // Blob → 문자열
    console.log("record JSON =>", txt);

    try {
      console.log("record parsed =>", JSON.parse(txt));
    } catch (e) {
      console.warn("JSON parse fail:", e);
    }
  }
};

export default function Record() {
  const [sessionBubbles, setSessionBubbles] = useState([]); // ✅ 세션 버퍼
  const [heroId, setHeroId] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showEmotion, setShowEmotion] = useState(false);
  const commitLockRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [role, setRole] = useState(null);
  const roleRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [emotion, setEmotion] = useState("calm");
  const [showSave, setShowSave] = useState(false);
  const [recordLists, setRecordLists] = useState([]);

  const [partialText, setPartialText] = useState("");
  const [chat, setChat] = useState([]); // 화면에는 항상 최신 1개만 보여줌
  const [composing, setComposing] = useState({ active: false, who: null, text: "" });

  const wsRef = useRef(null);
  const mediaRecRef = useRef(null);
  const streamRef = useRef(null);
  const listEndRef = useRef(null);

  const currentChunksRef = useRef([]);     // ✅ 이번 발화의 오디오 청크들
  const utterStartRef = useRef(null);      // ✅ 발화 시작시간

  const WS_URL =
    "ws://localhost:9000/ws/stt?encoding=OGG_OPUS&sample_rate=16000&use_itn=true&model_name=sommers_ko&domain=CALL";

  useEffect(() => {
    if (!showSave) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:9000/api/record-names"); // [{id,name}]
        const data = await res.json();
        setRecordLists(Array.isArray(data) ? data : []);
      } catch {
        setRecordLists([]);
      }
    })();
  }, [showSave]);

  const scrollToBottom = () => listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const HERO_IMG_CLASS = "w-48 h-48";

  const pickMime = () => {
    const c = ["audio/ogg;codecs=opus", "audio/webm;codecs=opus", "audio/ogg", "audio/webm"];
    for (const m of c) if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
    return "";
  };

  const parseStt = (raw) => {
    if (typeof raw !== "string") return null;
    try {
      const msg = JSON.parse(raw);
      const alt = Array.isArray(msg.alternatives) ? msg.alternatives[0] : null;
      const text = (alt?.transcript || alt?.text || msg.transcript || msg.text || "").trim();
      const isFinal = msg.final === true || msg.type === "final";
      const isPartial = msg.type === "partial" || (!isFinal && !!text);
      return { isFinal, isPartial, text };
    } catch { return null; }
  };

  /** ---------- WebSocket ---------- */
  const connectWS = () =>
    new Promise((resolve, reject) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setConnected(true);
        return resolve();
      }
      const ws = new WebSocket(WS_URL);
      ws.binaryType = "arraybuffer";
      ws.onopen = () => { setConnected(true); wsRef.current = ws; resolve(); };
      ws.onmessage = (e) => {
        const parsed = parseStt(e.data);
        if (!parsed) return;

        if (parsed.isFinal && parsed.text) {
          setComposing((prev) => {
            if (!prev.active) return prev;
            const merged = (prev.text ? prev.text + " " : "") + parsed.text;
            return { ...prev, text: merged.trim() };
          });
          setPartialText("");
          scrollToBottom();
          return;
        }
        if (parsed.isPartial && parsed.text) {
          setPartialText(parsed.text);
          return;
        }
      };
      ws.onclose = () => { setConnected(false); wsRef.current = null; };
      ws.onerror = (err) => { console.error("[WS] error", err); reject(err); };
    });

  const disconnectWS = () => {
    if (wsRef.current) { try { wsRef.current.close(1000, "user-toggle"); } catch { } wsRef.current = null; }
    setConnected(false);
  };

  /** ---------- Recording ---------- */
  const startRecording = async (who) => {
    // 이번 발화 준비
    currentChunksRef.current = [];
    utterStartRef.current = Date.now();      // ✅ 시작시간
    setChat([]);                             // 이전 발화 제거
    setHeroId(null);
    setComposing({ active: true, who, text: "" });
    setPartialText("");
    commitLockRef.current = false;

    roleRef.current = who;
    setRole(who);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connectWS();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, sampleRate: 16000, noiseSuppression: true, echoCancellation: true, autoGainControl: true },
    });
    streamRef.current = stream;

    const mime = pickMime();
    if (!mime) { alert("브라우저가 OGG/WEBM OPUS 녹음을 지원하지 않습니다."); return; }

    const rec = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 64000 });
    mediaRecRef.current = rec;

    rec.ondataavailable = async (ev) => {
      if (ev.data && ev.data.size > 0) currentChunksRef.current.push(ev.data); // ✅ 오디오 누적
      if (!ev.data || ev.data.size === 0) return;
      const buf = await ev.data.arrayBuffer();
      if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(buf);
    };
    rec.onerror = (e) => console.error("MediaRecorder error", e);

    rec.start(150);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    try { wsRef.current?.send("EOS"); } catch { }
    try { if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") mediaRecRef.current.stop(); } catch { }
    mediaRecRef.current = null;
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }

    setComposing((prev) => {
      if (prev.active && !commitLockRef.current) {
        const finalText = ((prev.text || "") + (partialText ? (prev.text ? " " : "") + partialText : "")).trim();
        if (finalText) {
          const newId = Date.now() + Math.random();
          setChat([{ id: newId, who: prev.who || "me", text: finalText }]);
          setHeroId(newId);

          // ✅ 이번 발화의 오디오 Blob/메타를 세션 버퍼에 저장
          const audioBlob = new Blob(currentChunksRef.current, { type: "audio/ogg;codecs=opus" });
          const endedAt = Date.now();
          const bubbleForSession = {
            id: newId,
            speaker: prev.who || "me",
            text: finalText,
            startedAt: utterStartRef.current,
            endedAt,
            durationMs: Math.max(0, endedAt - (utterStartRef.current || endedAt)),
            audioBlob, // 🔴 파일
            emotion: (emotion || "calm"),
          };
          setSessionBubbles((old) => [...old, bubbleForSession]);

          sendToServer(prev.who || "me", finalText);
        }
        commitLockRef.current = true;
      }
      setPartialText("");
      return { active: false, who: null, text: "" };
    });

    scrollToBottom();
  };

  /** ---------- 테스트 전송 (그대로 유지) ---------- */
  const sendToServer = async (who, text) => {
    console.log("📤 서버 전송 시도:", { speaker: who, content: text });
    try {
      const res = await fetch("http://localhost:9000/healthz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speaker: who, content: text }),
      });
      const data = await res.json();
      console.log("✅ 서버 응답:", data);
      const label = data?.label;
      setEmotion(label);
    } catch (err) { console.error("❌ 서버 전송 실패:", err); }
  };

  /** ---------- 저장/취소 ---------- */
  const cancelSession = () => {
    // 화면/세션 초기화 (DB 저장 없이 날림)
    setChat([]);
    setHeroId(null);
    setSessionBubbles([]);
  };

  // 실제 저장용 FormData 구성 (메타 + 파일들)
  const buildFormData = ({ recordListId, recordListTitle }) => {
    const meta = sessionBubbles.map((b, i) => ({
    // ✅ 백엔드가 요구하는 필드들
    bTalker: b.speaker || "me",                // boolean 으로 변환
   bText: b.text,
   bEmotion: ((b.emotion || emotion || "calm")), // Enum 매핑 대비
    bLength: null,                               // 길이는 서버에서 durationMs로 보정
    durationMs: b.durationMs,

    // (참고) 디버깅/추적용으로 기존 값들도 같이 보낼 수 있다면:
    id: b.id,
    startedAt: b.startedAt,
    endedAt: b.endedAt,

    // 버블 오디오 파일 필드명
    fileField: `audio_${i}`,
  }));
    const form = new FormData();
    form.append("record", new Blob([JSON.stringify({
   voiceField: null,                    // 세션 통짜 오디오 쓸 거면 필드명 넣기
   record: {                            // ✅ 반드시 포함
     rlId: recordListId ?? null,
     rLength: null,
     rVoice: null
   },
   bubbles: meta,                       // meta에 fileField: "audio_i", durationMs 포함
  recordListTitle: recordListTitle || null, // ← 없으면 null                    // 새 리스트 생성 시 제목
   userId: "current-user-id"            // (선택) 서버에서 SecurityContext 쓰면 생략 가능
 })], { type: "application/json" }))
    sessionBubbles.forEach((b, i) => form.append(`audio_${i}`, b.audioBlob, `utt_${i}.ogg`));
    
    return form;
  };

const saveSession = async ({ recordListId, recordListTitle }) => {
  if (sessionBubbles.length === 0) return;
  try {
    const form = buildFormData({ recordListId, recordListTitle });

    // ✅ 여기서 디버깅!
    await debugForm(form);

    const res = await fetch("http://localhost:9000/api/records/save", { 
      method: "POST", 
      body: form 
    });
    const data = await res.json();
    console.log("✅ 저장 완료:", data);

    setChat([]); 
    setHeroId(null); 
    setSessionBubbles([]); 
    setEmotion("calm");
    setShowSave(false);
  } catch (e) { 
    console.error("❌ 저장 실패:", e); 
  }
};

  /** ---------- UI handlers ---------- */
  const onPartnerClick = async () => { if (!isRecording) await startRecording("partner"); else stopRecording(); };
  const onMeClick = async () => { if (!isRecording) await startRecording("me"); else stopRecording(); };

  /** ---------- lifecycle ---------- */
  useEffect(() => {
    return () => {
      try { mediaRecRef.current?.stop(); } catch { }
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      disconnectWS();
    };
  }, []);
  useEffect(() => { roleRef.current = role; }, [role]);

  /** ---------- render ---------- */
  return (
    <div className="h-full bg-text-200 flex flex-col relative">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-8">
        <FaBook className="text-white h-5 w-5"
          onClick={() => setShowEmotion(true)}
        />
        <div className="text-sm text-white/80">WS: {connected ? "🟢" : "🔴"} / REC: {isRecording ? "🟣" : "⚪"}</div>
        <FiHelpCircle className="text-white h-6 w-6" onClick={() => setShowHelp(true)} />
      </div>

      {/* 상단: 상대 버튼 */}
      <div
        onClick={onPartnerClick}
        className={`cursor-pointer mx-auto w-20 h-20 rounded-full bg-white border-4 flex items-center justify-center 
          ${isRecording && role === "partner" ? "border-cloud-parter" : "border-cloud-partner"}`}
        title={isRecording && role === "partner" ? "녹음 종료" : "상대방 녹음 시작"}
      >
        <span className="w-12 h-12">
          <img src="src/assets/images/구르미.svg" />
        </span>
      </div>

      {/* 중앙: 실시간/채팅 */}
      <div className="flex-1 mt-4 px-6 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-10">
          {!isRecording && chat.length === 0 && (
            <div className="flex justify-center md:my-20 my-[30px]">
              <img src={defaultHero} alt="calm" className={HERO_IMG_CLASS} />
            </div>
          )}
          {chat.map((m) => (
            <div key={m.id}>
              {m.id === heroId && (
                <div className="flex justify-center my-4">
                  <img src={getEmotionImg(emotion)} alt={emotion || "hero"} className={HERO_IMG_CLASS} />
                </div>
              )}
              <div className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-7 whitespace-pre-wrap
                    ${m.who === "me" ? "bg-cloud-mine text-text-400 rounded-br-md" : "bg-cloud-partner text-text-400 rounded-bl-md"}`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          {/* 진행중 말풍선 */}
          {composing.active && (
            <div className={`flex ${composing.who === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] h-full px-4 py-3 rounded-2xl text-base leading-7 opacity-95 whitespace-pre-wrap
                  ${composing.who === "me" ? "bg-cloud-mine text-white rounded-br-md" : "bg-cloud-partner text-slate-800 rounded-bl-md"}`}
              >
                {(composing.text ? composing.text + (partialText ? " " : "") : "") + (partialText || "")}
              </div>
            </div>
          )}


          <div ref={listEndRef} />
        </div>
      </div>

      {/* 하단: 내 버튼 */}
      <button
        onClick={onMeClick}
        className={`absolute left-1/2 -translate-x-1/2
      bottom-[calc(env(safe-area-inset-bottom)+96px)]
      md:bottom-[calc(env(safe-area-inset-bottom)+187px)]
      w-20 h-20 rounded-full bg-white border-4 shadow-xl flex items-center justify-center
      ${isRecording && role === "me" ? "border-cloud-partner" : "border-cloud-mine"}`}
      >
        <span className="w-12 h-12">
          <img src="src/assets/images/구르미.svg" />
        </span>
      </button>

      {/* ✅ 결과 화면에서 '취소/저장' 버튼 (녹음이 끝났고 말풍선이 떠 있을 때만) */}
      {!isRecording && chat.length === 1 && (
        <div className="flex justify-around items-center p-3 mb-44 text-white text-lg font-semibold select-none">
          <button onClick={cancelSession} className="opacity-90">취소</button>

          <button onClick={() => setShowSave(true)} className="opacity-90">저장</button>
        </div>
      )}

      {showHelp && <HelpScreen onClose={() => setShowHelp(false)} />}
      {showEmotion && <EmotionCard onClose={() => setShowEmotion(false)} />}
      <SaveDialog
        open={showSave}
        onClose={() => setShowSave(false)}
        lists={recordLists}
        onConfirm={(payload) => saveSession(payload)}
      />
    </div>
  );
}