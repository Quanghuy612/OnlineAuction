import React, { useState, ReactNode, useEffect } from "react";
import { NotifyContext } from "../contexts/NotifyContext";
import Notify from "../components/Notify";
import { useApi } from "../store/useApi";

export const NotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const { error, success } = useApi();

    const showNotify = (msg: string, type: "success" | "error" | "warning" | "info" = "success") => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (error) {
            showNotify(error, "error");
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            showNotify(success, "success");
        }
    }, [success]);

    return (
        <NotifyContext.Provider value={{ showNotify }}>
            {children}
            <Notify open={open} message={message} severity={severity} onClose={handleClose} />
        </NotifyContext.Provider>
    );
};
