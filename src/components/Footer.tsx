import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 2, textAlign: "center", mt: "auto" }}>
            <Typography variant="body2">&copy; {new Date().getFullYear()} My App</Typography>
        </Box>
    );
};

export default Footer;
