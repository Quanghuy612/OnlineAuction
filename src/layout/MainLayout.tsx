import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ScrollTop from "../components/ScrollTop";

const Layout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ScrollTop />
            <Outlet />
        </Box>
    );
};

export default Layout;
