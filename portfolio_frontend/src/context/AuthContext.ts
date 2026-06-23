import { createContext } from 'react';
import type { JwtPayload } from './AuthProvider';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    user: JwtPayload | null;
    login: (token: string) => void;
    logout: () => void;
}
 
const AuthContext = createContext<AuthContextType | null>(null);
 
export default AuthContext;