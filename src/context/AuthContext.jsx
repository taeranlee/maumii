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
  console.log("=== Reducer 호출 ===", {
    action: action.type,
    currentState: state,
  });

  switch (action.type) {
    case "SET_USER":
      // HTML 문자열이나 잘못된 데이터 필터링
      const isValidUser =
        action.payload &&
        typeof action.payload === "object" &&
        !action.payload.toString().includes("<!doctype") &&
        !action.payload.toString().includes("<html");

      if (!isValidUser) {
        console.log("❌ 잘못된 user 데이터, 로그아웃 처리:", action.payload);
        return { ...state, user: null, isAuth: false };
      }

      const newStateSetUser = { ...state, user: action.payload, isAuth: true };
      console.log("✅ SET_USER 후 상태:", newStateSetUser);
      return newStateSetUser;

    case "SET_CHECKED":
      const newStateSetChecked = { ...state, checked: action.payload };
      console.log("SET_CHECKED 후 상태:", newStateSetChecked);
      return newStateSetChecked;

    case "LOGOUT":
      const newStateLogout = { ...state, user: null, isAuth: false };
      console.log("LOGOUT 후 상태:", newStateLogout);
      return newStateLogout;

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 앱 시작시 서버 세션 확인 (localStorage 사용 안함)
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isMounted) return;

      try {
        console.log("=== /auth/me API 호출 시작 ===");
        const response = await api.get("/api/auth/me");
        console.log("API 응답:", response);

        // 응답이 실제 사용자 데이터인지 확인
        if (
          response.data &&
          typeof response.data === "object" &&
          !response.data.message
        ) {
          console.log("유효한 사용자 데이터:", response.data);
          if (isMounted) {
            dispatch({ type: "SET_USER", payload: response.data });
          }
        } else {
          console.log("유효하지 않은 응답, 로그아웃 처리");
          if (isMounted) {
            dispatch({ type: "LOGOUT" });
          }
        }
      } catch (error) {
        console.log("=== API 호출 실패 ===", error);
        console.log("에러 응답:", error.response?.data);

        if (isMounted) {
          dispatch({ type: "LOGOUT" });
        }
      } finally {
        console.log("=== 세션 체크 완료, checked = true ===");
        if (isMounted) {
          dispatch({ type: "SET_CHECKED", payload: true });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---- API actions ----
  const login = useCallback(async (uId, uPwd) => {
    console.log("=== 로그인 시도 ===", { uId });

    // 여러 가능한 엔드포인트 시도
    const possibleEndpoints = [
      "/api/auth/signin", // 기본
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`시도 중: POST ${endpoint}`);
        const { data } = await api.post(endpoint, { uId, uPwd });
        console.log(`✅ ${endpoint} 성공:`, data);
        dispatch({ type: "SET_USER", payload: data });
        return data;
      } catch (error) {
        console.log(
          `❌ ${endpoint} 실패:`,
          error.response?.status,
          error.response?.data
        );
        if (error.response?.status !== 404) {
          // 404가 아닌 다른 에러면 더 이상 시도하지 않음
          throw error;
        }
      }
    }

    // 모든 엔드포인트가 404라면
    throw new Error("로그인 API 엔드포인트를 찾을 수 없습니다");
  }, []);

  const fetchMe = useCallback(async () => {
    const { data } = await api.get("/api/auth/me");
    dispatch({ type: "SET_USER", payload: data });
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
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
