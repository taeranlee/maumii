// src/components/SafeText.jsx
import { useEffect, useState } from "react";
import { useExposure } from "../hooks/useExposure";
import { rzSanitize } from "../services/returnzeroClient";

export default function SafeText({ text }) {
  const exposureOn = useExposure();
  const [safe, setSafe] = useState(text);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!exposureOn) return setSafe(text);
      try {
        const sanitized = await rzSanitize(text);
        if (alive) setSafe(sanitized);
      } catch {
        // 실패 시 원문 그대로
        if (alive) setSafe(text);
      }
    })();
    return () => (alive = false);
  }, [text, exposureOn]);

  return <>{safe}</>;
}