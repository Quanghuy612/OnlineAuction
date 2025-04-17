import { useState } from "react";

interface UsePaginateReturn {
    currentPage: number;
    totalPages: number;
    setTotalPages: (total: number) => void;
    goToPage: (page: number) => void;
}

export const usePaginate = (): UsePaginateReturn => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return { currentPage, totalPages, setTotalPages, goToPage };
};
