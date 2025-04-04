import { Breadcrumbs, Typography, Divider } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Home, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";

const StyledLink = styled(RouterLink)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
}));

const BreadCrumb = () => {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight fontSize="small" />} sx={{ mt: 2, mb: 2 }}>
                <StyledLink to="/">
                    <Home fontSize="small" sx={{ mr: 0.5 }} />
                    <b>Home</b>
                </StyledLink>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    return (
                        <Typography key={to} color="text.primary">
                            <StyledLink to={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</StyledLink>
                        </Typography>
                    );
                })}
            </Breadcrumbs>
            <Divider sx={{ mt: 2, mb: 2 }} />
        </motion.div>
    );
};

export default BreadCrumb;
