import { useState, useEffect, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    interface UserPayload {
        userId: string;
        username: string;
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    }

    const [cookies, setCookie, removeCookie] = useCookies(["token", "refreshToken"]);
    const [id, setId] = useState<number | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (cookies.token) {
            try {
                const decoded = jwtDecode<UserPayload>(cookies.token);
                setId(parseInt(decoded.userId));
                setUser(decoded.username);
                setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
                setToken(cookies.token);
            } catch (err) {
                console.error("Invalid token:", err);
                setId(null);
                setUser(null);
                setToken(null);
            }
        } else {
            setId(null);
            setUser(null);
            setToken(null);
        }
    }, [cookies.token]);

    const login = (token: string, refreshToken: string) => {
        setCookie("token", token, { path: "/", sameSite: "strict" });
        setCookie("refreshToken", refreshToken, { path: "/", sameSite: "strict" });
        setTimeout(() => {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }, 50);
    };

    const logout = () => {
        removeCookie("token");
        removeCookie("refreshToken");
        navigate("/login");
    };

    return <AuthContext.Provider value={{ id, user, role, token, login, logout }}>{children}</AuthContext.Provider>;
};
