import { createContext } from "react";

interface NotifyContextType {
    showNotify: (message: string, severity?: "success" | "error" | "warning" | "info") => void;
}

export const NotifyContext = createContext<NotifyContextType | undefined>(undefined);
