import { motion } from "framer-motion";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import LoginRequest from "../../types/LoginRequest";
import { useApi } from "../../store/useApi";
import { useAuth } from "../../hooks/useAuth";

const schema = Yup.object({
    Username: Yup.string().required("Username is required"),
    Password: Yup.string().required("Password is required"),
});

function Login() {
    const { apiCall } = useApi();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (loginData: LoginRequest) => {
        const result = await apiCall("POST", "/auth/login", undefined, loginData);
        if (result.success && result.data) {
            const { token } = result.data as { token: string };
            const { refreshToken } = result.data as { refreshToken: string };
            login(token, refreshToken);
        }
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Box
                    sx={{
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

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            {...register("Username")}
                            error={Boolean(errors.Username)}
                            helperText={errors.Username?.message}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            {...register("Password")}
                            error={Boolean(errors.Password)}
                            helperText={errors.Password?.message}
                        />

                        <Button type="submit" variant="contained" className="btn btn-primary" fullWidth sx={{ mt: 2 }}>
                            Login
                        </Button>
                    </form>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don't have an account?{" "}
                        <Link component={RouterLink} to="/signup" color="primary">
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </motion.div>
        </Container>
    );
}

export default Login;
