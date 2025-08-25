// src/pages/Record.jsx
import { useEffect, useRef, useState } from "react";
import { FaBook } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import HelpScreen from "./HelpScreen";

export default function Record() {
  const [showHelp, setShowHelp] = useState(false);
  const commitLockRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [role, setRole] = useState(null);          // "partner" | "me"
  const roleRef = useRef(null);

  const [partialText, setPartialText] = useState("");    // 실시간(부분)
  const [chat, setChat] = useState([]);                  // 확정 말풍선 [{id, who, text}]
  const [composing, setComposing] = useState({           // 누르는 동안 누적 말풍선
    active: false,
    who: null,
    text: "",
  });

  const wsRef = useRef(null);
  const mediaRecRef = useRef(null);
  const streamRef = useRef(null);
  const listEndRef = useRef(null);

  const WS_URL =
    "ws://localhost:9000/ws/stt?encoding=OGG_OPUS&sample_rate=16000&use_itn=true&model_name=sommers_ko&domain=CALL";

  const scrollToBottom = () => listEndRef.current?.scrollIntoView({ behavior: "smooth" });

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
    } catch {
      return null;
    }
  };

  /** ---------------- WS ---------------- */
  const connectWS = () =>
    new Promise((resolve, reject) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setConnected(true);
        return resolve();
      }
      const ws = new WebSocket(WS_URL);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        setConnected(true);
        wsRef.current = ws;
        resolve();
      };

      ws.onmessage = (e) => {
        const parsed = parseStt(e.data);
        if (!parsed) return;

        // 1) final: 누적 말풍선에만 이어붙임. 리스트에는 절대 즉시 push X
        if (parsed.isFinal && parsed.text) {
          setComposing((prev) => {
            if (!prev.active) return prev; // 안전장치
            const merged = (prev.text ? prev.text + " " : "") + parsed.text;
            return { ...prev, text: merged.trim() };
          });
          setPartialText("");
          scrollToBottom();
          return;
        }

        // 2) partial: 가운데 크게만 보여줌(누적 말풍선은 그대로 유지)
        if (parsed.isPartial && parsed.text) {
          setPartialText(parsed.text);
          return;
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
      };

      ws.onerror = (err) => {
        console.error("[WS] error", err);
        reject(err);
      };
    });

  const disconnectWS = () => {
    if (wsRef.current) {
      try { wsRef.current.close(1000, "user-toggle"); } catch { }
      wsRef.current = null;
    }
    setConnected(false);
  };

  /** ---------------- Recording ---------------- */
  const startRecording = async (who) => {
    commitLockRef.current = false;
    roleRef.current = who;
    setRole(who);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connectWS();
    }

    // 누적 말풍선 시작(빈 버퍼)
    setComposing({ active: true, who, text: "" });
    setPartialText("");

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, sampleRate: 16000, noiseSuppression: true, echoCancellation: true, autoGainControl: true },
    });
    streamRef.current = stream;

    const mime = pickMime();
    if (!mime) {
      alert("브라우저가 OGG/WEBM OPUS 녹음을 지원하지 않습니다.");
      return;
    }

    const rec = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 64000 });
    mediaRecRef.current = rec;

    rec.ondataavailable = async (ev) => {
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

    try {
      if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
        mediaRecRef.current.stop();
      }
    } catch { }
    mediaRecRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // ✅ 여기서만 확정 push, 그리고 '단 한 번'만 수행
    setComposing((prev) => {
      if (prev.active && !commitLockRef.current) {
        const finalText = ((prev.text || "") + (partialText ? (prev.text ? " " : "") + partialText : "")).trim();
        if (finalText) {
          setChat((old) => [...old, { id: Date.now() + Math.random(), who: prev.who || "me", text: finalText }]);
          sendToServer(prev.who || "me", finalText);
        }
        commitLockRef.current = true;   // ✅ 다시 못 들어오게 잠금
      }
      setPartialText("");
      return { active: false, who: null, text: "" };
    });

    scrollToBottom();
  };

  // 서버 전송 함수
  const sendToServer = async (who, text) => {
    console.log("📤 서버 전송 시도:", { speaker: who, content: text }); // ✅ 콘솔 출력

    try {
      const res = await fetch("http://localhost:9000/healthz", {
        method: "POST", // GET 대신 POST로 테스트 (데이터 전달)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speaker: who, content: text }),
      });

      const data = await res.json();
      console.log("✅ 서버 응답:", data);
    } catch (err) {
      console.error("❌ 서버 전송 실패:", err);
    }
  };

  /** ---------------- UI handlers ---------------- */
  const onPartnerClick = async () => {
    if (!isRecording) await startRecording("partner");
    else stopRecording();
  };
  const onMeClick = async () => {
    if (!isRecording) await startRecording("me");
    else stopRecording();
  };

  /** ---------------- lifecycle ---------------- */
  useEffect(() => {
    return () => {
      try { mediaRecRef.current?.stop(); } catch { }
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      disconnectWS();
    };
  }, []);
  useEffect(() => { roleRef.current = role; }, [role]);

  /** ---------------- render ---------------- */
  return (
    <div className="h-full bg-text-200 flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-6 py-4">
        <FaBook className="text-white h-5 w-5" />
        <div className="text-sm text-white/80">
          WS: {connected ? "🟢" : "🔴"} / REC: {isRecording ? "🟣" : "⚪"}
        </div>
        <FiHelpCircle className="text-white h-6 w-6"
          onClick={() => setShowHelp(true)} />
      </div>

      {/* 상단: 상대 버튼 */}
      <div
        onClick={onPartnerClick}
        className={`cursor-pointer mx-auto w-24 h-24 rounded-full bg-white border-4 flex items-center justify-center 
          ${isRecording && role === "partner" ? "border-green-500" : "border-cloud-partner"}`}
        title={isRecording && role === "partner" ? "녹음 종료" : "상대방 녹음 시작"}
      >
        <span className="text-base font-semibold">상대</span>
      </div>

      {/* 중앙: 실시간/채팅 */}
      <div className="flex-1 mt-4 px-6 overflow-hidden flex flex-col">
        {/* 고정 영역 */}
        {/* <div className="text-center text-white text-2xl font-semibold min-h-[36px] mb-4 flex-none">
          {partialText || "새로운 녹음"}
        </div> */}

        {/* 스크롤 리스트 */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-56">   {/* ✅ 버튼 높이만큼 margin-bottom */}
          {chat.map((m) => (
            <div key={m.id} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-7 whitespace-pre-wrap
            ${m.who === "me" ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-slate-800 rounded-bl-md"}`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {composing.active && (
            <div className={`flex ${composing.who === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-7 opacity-95 whitespace-pre-wrap
            ${composing.who === "me" ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-slate-800 rounded-bl-md"}`}
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
        className={`fixed left-1/2 -translate-x-1/2 bottom-[115px] w-24 h-24 rounded-full bg-white border-4 
    shadow-xl flex items-center justify-center
    ${isRecording && role === "me" ? "border-blue-500" : "border-cloud-mine"}`}
      >
        <span className="text-base font-semibold">나</span>
      </button>

{/* ❗도움말 오버레이 */}
      {showHelp && <HelpScreen onClose={() => setShowHelp(false)} />}
    </div>
  );
}