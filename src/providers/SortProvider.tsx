import React, { useState } from "react";
import { SortContext } from "../contexts/SortContext";

export const SortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isGridView, setIsGridView] = useState(true);

    const toggleView = () => setIsGridView((prev) => !prev);

    return <SortContext.Provider value={{ isGridView, toggleView }}>{children}</SortContext.Provider>;
};
