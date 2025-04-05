import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <AppBar className="header">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <NavLink to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
                    <Box component="img" src="/images/logo.png" alt="Logo" sx={{ height: 50, marginRight: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        AUCTION
                    </Typography>
                </NavLink>

                <Box sx={{ display: "flex", gap: 3 }}>
                    <NavLink to="/auction">
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            My Auction
                        </Button>
                    </NavLink>
                    <NavLink to="/news">
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            News
                        </Button>
                    </NavLink>
                    <NavLink to="/browse">
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            Browse
                        </Button>
                    </NavLink>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <NavLink to="/login">
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            Login
                        </Button>
                    </NavLink>
                    <NavLink to="/signup">
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            Sign Up
                        </Button>
                    </NavLink>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
