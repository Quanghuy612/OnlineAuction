import { Box, Container } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import { Outlet } from "react-router-dom";
import SortBar from "../components/SortBar";
import BreadCrumb from "../components/BreadCrumb";

const Layout = () => {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
            <Header />
            <Container maxWidth={false} sx={{ px: 3, mt: 8 }}>
                <BreadCrumb />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: 250, pr: 2 }}>
                        <Filter />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <SortBar />
                        <Outlet />
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout;
