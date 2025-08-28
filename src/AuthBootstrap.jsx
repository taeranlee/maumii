// src/AuthBootstrap.jsx
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function AuthBootstrap({ children }) {
  const { fetchMe, dispatch } = useAuth();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!alive) return;
        await fetchMe();      // 세션이 있으면 유저 복구
      } catch {
        if (alive) dispatch({ type: "SET_USER", payload: null }); // 비로그인
      }
    })();
    return () => { alive = false; };
  }, [fetchMe, dispatch]);

  return <>{children}</>;
}
