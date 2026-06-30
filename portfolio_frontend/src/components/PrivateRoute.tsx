import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        return exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const PrivateRoute = ({ children }: { children: React.ReactNode}) => {
    const { isAuthenticated, token, logout } = useAuth();

    const expired = Boolean(token && isTokenExpired(token));

    useEffect(() => {
        if (isAuthenticated && expired) {
            logout();
        }
    }, [expired, isAuthenticated, logout]);

    if (!isAuthenticated || expired) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;