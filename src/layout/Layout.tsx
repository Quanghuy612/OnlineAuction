import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Box, Container } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const drawerWidth = 240;

const Layout = () => {
    const [isStatic, setIsStatic] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar open={open} isStatic={isStatic} onClose={() => setOpen(false)} onToggleStatic={setIsStatic} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    ml: isStatic ? `${drawerWidth}px` : 0,
                    transition: "margin 0.3s ease-in-out",
                }}
            >
                <Header isStatic={isStatic} onToggle={() => setOpen(true)} />
                <Container
                    sx={{
                        flex: 1,
                        mt: 10,
                    }}
                >
                    <Outlet />
                </Container>
                <Footer />
            </Box>
        </Box>
    );
};

export default Layout;
