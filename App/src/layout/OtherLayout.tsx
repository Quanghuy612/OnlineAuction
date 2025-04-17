import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const OtherLayout = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
};

export default OtherLayout;
