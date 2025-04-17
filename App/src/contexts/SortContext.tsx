import { createContext } from "react";

export interface SortContextType {
    isGridView: boolean;
    toggleView: () => void;
}

export const SortContext = createContext<SortContextType | undefined>(undefined);
