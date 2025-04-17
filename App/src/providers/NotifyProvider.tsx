import React, { useState, ReactNode, useEffect } from "react";
import { NotifyContext } from "../contexts/NotifyContext";
import Notify from "../components/Notify";
import { useApi } from "../store/useApi";

export const NotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [severity, setSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const { success, message } = useApi();

    const showNotify = (msg: string, type: "success" | "error" | "warning" | "info" = "success") => {
        setMsg(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (message) {
            const safeMessage = message ?? (success ? "Operation successful." : "Something went wrong.");
            showNotify(safeMessage, success ? "success" : "error");
        }
    }, [success, message]);

    return (
        <NotifyContext.Provider value={{ showNotify }}>
            {children}
            <Notify open={open} message={msg} severity={severity} onClose={handleClose} />
        </NotifyContext.Provider>
    );
};
