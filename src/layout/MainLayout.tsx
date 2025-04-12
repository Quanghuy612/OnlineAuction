import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import ScrollTop from "../components/ScrollTop";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BreadCrumb from "../components/BreadCrumb";

const Layout = () => {
    return (
        <Box>
            <ScrollTop />
            <Header />
            <Container sx={{ mt: 10, minHeight: "100vh" }}>
                <BreadCrumb />
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout;
