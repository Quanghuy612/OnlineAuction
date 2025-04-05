import { useContext } from "react";
import { SortContext } from "../contexts/SortContext";

export const useSort = () => {
    const context = useContext(SortContext);
    if (!context) throw new Error("useViewContext must be used within a ViewProvider");
    return context;
};
