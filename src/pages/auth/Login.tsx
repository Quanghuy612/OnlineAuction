import { motion } from "framer-motion";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Login() {
    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Box
                    sx={{
                        mt: 5,
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        textAlign: "center",
                        backgroundColor: "white",
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <TextField fullWidth label="Email" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" />
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don't have an account?{" "}
                        <Link component={RouterLink} to="/signup" sx={{ color: "primary.main" }}>
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </motion.div>
        </Container>
    );
}

export default Login;
