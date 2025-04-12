import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
};

export default AdminLayout;
