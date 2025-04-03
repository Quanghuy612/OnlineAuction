import React from "react";
import { Pagination, PaginationItem } from "@mui/material";

interface PaginateProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Paginate: React.FC<PaginateProps> = ({ totalPages, currentPage, onPageChange }) => {
    return (
        <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            renderItem={(item) => <PaginationItem {...item} />}
        />
    );
};

export default Paginate;
