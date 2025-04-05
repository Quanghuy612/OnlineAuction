import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import { Outlet } from "react-router-dom";
import SortBar from "../components/SortBar";
import BreadCrumb from "../components/BreadCrumb";
import { SortProvider } from "../providers/SortProvider";

const AuctionLayout = () => {
    const theme = useTheme();
    const mdBreak = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header />
            <Container sx={{ mt: 8 }}>
                <BreadCrumb />
                <Box sx={{ display: "flex" }}>
                    <Filter mdBreak={mdBreak} />
                    <SortProvider>
                        <Box sx={{ flex: 1 }}>
                            <SortBar mdBreak={mdBreak} />
                            <Outlet />
                        </Box>
                    </SortProvider>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default AuctionLayout;
