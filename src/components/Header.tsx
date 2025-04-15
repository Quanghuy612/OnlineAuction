import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
    const { id, user, role, logout } = useAuth();
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
                    <NavLink to={`/user/auctions/${id}`}>
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            My Auction
                        </Button>
                    </NavLink>
                    <NavLink to={`/user/products/${id}`}>
                        <Button sx={{ color: "white" }} className="btn_secondary-hover">
                            My Products
                        </Button>
                    </NavLink>
                    {role === "Admin" && (
                        <NavLink to="/admin">
                            <Button sx={{ color: "white" }} className="btn_secondary-hover btn-fifth">
                                Admin Page
                            </Button>
                        </NavLink>
                    )}
                </Box>

                {user ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ color: "white" }}>{user}</Typography>
                        <Button onClick={logout} sx={{ color: "white" }} className="btn_secondary-hover">
                            Logout
                        </Button>
                    </Box>
                ) : (
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
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
