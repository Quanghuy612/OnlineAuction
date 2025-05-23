import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarProps {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
    onClose: () => void;
}

const Notify: React.FC<SnackbarProps> = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert onClose={onClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notify;
