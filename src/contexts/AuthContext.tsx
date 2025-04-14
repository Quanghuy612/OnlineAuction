import { createContext } from "react";

interface AuthContextType {
    id: number | null;
    user: string | null;
    token: string | null;
    role: string | null;
    login: (token: string, refreshToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
