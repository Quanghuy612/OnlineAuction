import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";

interface HeaderProps {
    isStatic: boolean;
    onToggle: () => void;
}

const drawerWidth = 240;

const Header: React.FC<HeaderProps> = ({ isStatic, onToggle }) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                width: isStatic ? `calc(100% - ${drawerWidth}px)` : "100%",
                ml: isStatic ? `${drawerWidth}px` : 0,
                transition: "margin 0.3s ease-in-out, width 0.3s ease-in-out",
                zIndex: 9,
            }}
            className="header"
        >
            <Toolbar>
                {!isStatic && (
                    <IconButton edge="start" color="inherit" onClick={onToggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                )}
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
