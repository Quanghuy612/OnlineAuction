import { Box, Button } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <Box>
            <Box sx={{ marginBottom: 2 }}>
                <NavLink to="/admin/auctions" style={{ marginRight: 5 }}>
                    <Button sx={{ color: "white" }} className="btn-primary">
                        Waitting Auctions
                    </Button>
                </NavLink>
                <NavLink to="/admin/users/report">
                    <Button sx={{ color: "white" }} className="btn-fifth">
                        User report
                    </Button>
                </NavLink>
            </Box>
            <Outlet />
        </Box>
    );
};

export default AdminLayout;
