// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback
} from "react";
import api from "../api/api";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuth: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isAuth: !!action.payload };
    case "LOGOUT":
      return { ...state, user: null, isAuth: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem("auth-state");
      if (raw) return { ...init, ...JSON.parse(raw) };
    } catch {}
    return init;
  });

  useEffect(() => {
    localStorage.setItem(
      "auth-state",
      JSON.stringify({ user: state.user, isAuth: state.isAuth })
    );
  }, [state.user, state.isAuth]);

  // ✅ 엔드포인트 수정: /auth/signin
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

  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      async (error) => {
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
