import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
            <Outlet />
        </Box>
    );
};

export default AuthLayout;
