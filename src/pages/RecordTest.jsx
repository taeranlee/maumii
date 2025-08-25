import { useEffect, useRef, useState } from "react";

export default function RecordTest() {
  const wsRef = useRef(null);
  const recRef = useRef(null);
  const streamRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [partials, setPartials] = useState("");
  const [lines, setLines] = useState([]);

  // RTZR 프록시 WS (서버에서 토큰 붙여 RTZR로 프록시)
  const WS_URL =
    "ws://localhost:9000/ws/stt?encoding=OGG_OPUS&sample_rate=16000&use_itn=true&model_name=sommers_ko&domain=CALL";

  /** ---------- WebSocket ---------- */
  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("[WS] OPEN");
      setConnected(true);
      // ws.send(JSON.stringify({ ping: Date.now() })); // 필요시
    };

    ws.onmessage = (e) => {
  // 문자열이면 JSON 파싱, 아니면 무시
  let msg;
  try {
    msg = typeof e.data === "string" ? JSON.parse(e.data) : null;
  } catch {
    console.log("[WS RAW]", e.data);
    return;
  }
  if (!msg) return;

  // 리턴제로 포맷 호환: transcript | text
  const alt = Array.isArray(msg.alternatives) ? msg.alternatives[0] : null;
  const text =
    (alt && (alt.transcript || alt.text)) ||
    msg.transcript ||
    msg.text ||
    "";

  // 1) 확정 결과
  if (msg.final === true || msg.type === "final") {
    const t = (text || "").trim();
    if (t) setLines((prev) => [...prev, t]);
    setPartials("");                 // 확정되면 실시간 칸 비움
    return;
  }

  // 2) 부분 결과(말하는 도중)
  if (text && text.trim()) {
    setPartials(text);               // 여기서 실시간으로 갱신
    return;
  }

  // 3) 그 외(디버그용)
  console.log("[WS MSG]", msg);
};

    ws.onclose = (e) => {
      console.log("[WS] CLOSE:", e.code, e.reason);
      setConnected(false);
      wsRef.current = null;
    };

    ws.onerror = (e) => console.error("[WS] ERROR", e);

    wsRef.current = ws;
  };

  const disconnect = () => {
    stopRecording();
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "user-toggle");
      } catch {}
      wsRef.current = null;
    }
  };

  /** ---------- Recording (MediaRecorder -> WS 바이너리 전송) ---------- */
  const startRecording = async () => {
    // WS 연결 보장
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
      await new Promise((r) => setTimeout(r, 200));
    }
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // 마이크 권한 및 스트림
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000, // 힌트(강제는 아님)
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true,
      },
    });
    streamRef.current = stream;

    const mime = "audio/ogg; codecs=opus";
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported(mime)) {
      alert("브라우저가 OGG/OPUS MediaRecorder를 지원하지 않습니다.");
      return;
    }

    const rec = new MediaRecorder(stream, {
      mimeType: mime,
      audioBitsPerSecond: 64000,
    });
    recRef.current = rec;

    rec.ondataavailable = async (ev) => {
      if (!ev.data || ev.data.size === 0) return;
      const buf = await ev.data.arrayBuffer();
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(buf); // 그대로 프록시 → RTZR
      }
    };

    rec.onerror = (e) => console.error("MediaRecorder error", e);
    rec.start(50); // 0.25초마다 청크 전송
    setRecording(true);
  };

  const stopRecording = () => {
    if (recRef.current && recRef.current.state !== "inactive") {
      recRef.current.stop();
      recRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    // 인식 종료 신호
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send("EOS");
      } catch {}
    }
    setRecording(false);
  };

  /** ---------- UI 핸들 ---------- */
  const toggle = async () => {
    if (!connected) {
      connect();
      await new Promise((r) => setTimeout(r, 150));
    }
    if (!recording) await startRecording();
    else stopRecording();
  };

  useEffect(() => {
    // 언마운트 시 정리
    return () => {
      stopRecording();
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={toggle}>
        {recording ? "🎙️ 녹음 종료" : connected ? "🎙️ 녹음 시작" : "🔌 연결+녹음 시작"}
      </button>
      <button
        onClick={() => (connected ? disconnect() : connect())}
        style={{ marginLeft: 8 }}
      >
        {connected ? "WS 끊기" : "WS 연결"}
      </button>

      <div style={{ marginTop: 8 }}>
        WS: {connected ? "🟢 OPEN" : "🔴 CLOSED"} / REC:{" "}
        {recording ? "🟣 ON" : "⚪ OFF"}
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div>
        <div style={{ opacity: 0.6 }}>실시간(부분)</div>
        <div
          style={{
            padding: 10,
            background: "#f6f6f6",
            borderRadius: 8,
            minHeight: 28,
          }}
        >
          {partials}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ opacity: 0.6 }}>확정 문장</div>
        <ol style={{ paddingLeft: 18 }}>
          {lines.map((t, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}