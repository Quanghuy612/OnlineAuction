import { useState, useEffect, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    interface UserPayload {
        username: string;
        role: string;
    }

    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (cookies.token) {
            try {
                const decoded = jwtDecode<UserPayload>(cookies.token);
                setUser(decoded.username);
                setRole(decoded.role);
                setToken(cookies.token);
            } catch (err) {
                console.error("Invalid token:", err);
                setUser(null);
                setToken(null);
                removeCookie("token");
            }
        } else {
            setUser(null);
            setToken(null);
        }
    }, [cookies.token]);

    const login = (token: string) => {
        setCookie("token", token, { path: "/", sameSite: "strict" });

        setTimeout(() => {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }, 50);
    };

    const logout = () => {
        removeCookie("token");
        navigate("/login");
    };

    return <AuthContext.Provider value={{ user, role, token, login, logout }}>{children}</AuthContext.Provider>;
};
