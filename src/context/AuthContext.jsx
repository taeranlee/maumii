// src/context/AuthContext.jsx - 세션 기반 인증
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import api from "../api/api";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuth: false,
  checked: false, // 서버 세션검증 완료 여부
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isAuth: !!action.payload };
    case "SET_CHECKED":
      return { ...state, checked: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isAuth: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 앱 시작시 서버 세션 확인 (localStorage 사용 안함)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // **디버깅: 강제로 로그아웃 상태로 설정**
        console.log("=== 강제로 로그아웃 상태로 설정 ===");
        dispatch({ type: "LOGOUT" });

        // 실제로는 이 코드를 사용해야 함:
        // const { data } = await api.get("/auth/me");
        // console.log("세션 확인 성공:", data);
        // dispatch({ type: "SET_USER", payload: data });
      } catch (error) {
        // 세션이 없거나 만료됨
        console.log("세션 없음 또는 만료:", error);
        dispatch({ type: "LOGOUT" });
      } finally {
        // 검증 완료 표시
        console.log("=== 세션 체크 완료, checked = true ===");
        dispatch({ type: "SET_CHECKED", payload: true });
      }
    };

    checkAuth();
  }, []);

  // ---- API actions ----
  const login = useCallback(async (uId, uPwd) => {
    const { data } = await api.post("/auth/signin", { uId, uPwd });
    dispatch({ type: "SET_USER", payload: data });
    return data;
  }, []);

  const fetchMe = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    dispatch({ type: "SET_USER", payload: data });
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  // 401 응답 시 자동 로그아웃
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401) {
          dispatch({ type: "LOGOUT" });
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  const value = useMemo(
    () => ({ ...state, login, fetchMe, logout, dispatch }),
    [state, login, fetchMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 편의 훅
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
