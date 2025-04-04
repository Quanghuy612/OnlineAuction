import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <AppBar className="header">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <NavLink to="/login">
                        <Button
                            sx={{
                                color: "white",
                            }}
                            className="btn_secondary-hover"
                        >
                            Login
                        </Button>
                    </NavLink>
                    <NavLink to="/signup">
                        <Button
                            sx={{
                                color: "white",
                            }}
                            className="btn_secondary-hover"
                        >
                            Sign Up
                        </Button>
                    </NavLink>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
