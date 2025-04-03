import { useState, useEffect, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    interface UserPayload {
        id: string;
        username: string;
        email: string;
        role: string;
    }
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (cookies.token) {
            const decoded = jwtDecode<UserPayload>(cookies.token);
            setUser(decoded.username);
            setToken(cookies.token);
        } else {
            setUser(null);
            setToken(null);
        }
    }, [cookies.token]);

    const login = (token: string) => {
        setCookie("token", token, { path: "/", secure: true, sameSite: "strict" });
    };

    const logout = () => {
        removeCookie("token");
    };

    return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};
