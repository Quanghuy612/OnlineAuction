import { useContext } from "react";
import { NotifyContext } from "../contexts/NotifyContext";

export const useNotify = () => {
    const context = useContext(NotifyContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};
