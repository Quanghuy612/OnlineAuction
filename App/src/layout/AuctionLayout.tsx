import { Box, useMediaQuery, useTheme } from "@mui/material";
import Filter from "../components/Filter";
import { Outlet } from "react-router-dom";
import SortBar from "../components/SortBar";
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
            <Box sx={{ display: "flex" }}>
                <Filter mdBreak={mdBreak} />
                <SortProvider>
                    <Box sx={{ flex: 1 }}>
                        <SortBar mdBreak={mdBreak} />
                        <Outlet />
                    </Box>
                </SortProvider>
            </Box>
        </Box>
    );
};

export default AuctionLayout;
