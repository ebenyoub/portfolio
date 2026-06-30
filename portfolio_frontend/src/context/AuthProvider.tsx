import { useState, type ReactNode } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

export type JwtPayload = {
  id: number;
  email: string;
  role: string;
};

const decodeToken = (token: string): JwtPayload => {
  return JSON.parse(atob(token.split(".")[1]));
};

const getSavedToken = (): { token: string | null; user: JwtPayload | null } => {
  const saved = localStorage.getItem("token");
  if (!saved) return { token: null, user: null };
  try {
    return { token: saved, user: decodeToken(saved) };
  } catch {
    localStorage.removeItem("token");
    return { token: null, user: null };
  }
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { token: savedToken, user: savedUser } = getSavedToken();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(savedToken);
  const [user, setUser] = useState<JwtPayload | null>(savedUser);

  const isAuthenticated = Boolean(token);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true })
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;