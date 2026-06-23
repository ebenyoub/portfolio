import { useState, type ReactNode } from "react";
import AuthContext from "./AuthContext";

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

const AuthProvider = ({ children }: AuthProviderProps) => {
  const savedToken = localStorage.getItem("token");

  const [token, setToken] = useState<string | null>(savedToken);
  const [user, setUser] = useState<JwtPayload | null>(
    savedToken ? decodeToken(savedToken) : null
  );

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
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;