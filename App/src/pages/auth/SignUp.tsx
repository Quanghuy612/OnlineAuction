import { motion } from "framer-motion";
import { TextField, Button, Container, Typography, Box, InputAdornment, IconButton, Link } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SignupRequest from "../../types/SignupRequest";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useApi } from "../../store/useApi";

const schema = yup.object().shape({
    Fullname: yup.string().required("Full Name is required"),
    Username: yup.string().required("Username is required"),
    Email: yup.string().email("Invalid email address").required("Email is required"),
    Password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    PhoneNumber: yup.string().optional(),
});

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { apiCall } = useApi();

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupRequest>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<SignupRequest> = async (SignupData) => {
        const result = await apiCall("POST", "/auth/signup", undefined, SignupData);
        if (result.success) {
            navigate("/login");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <Container maxWidth="sm">
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
                        Sign Up
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            margin="normal"
                            {...register("Fullname")}
                            error={!!errors.Fullname}
                            helperText={errors.Fullname?.message}
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            {...register("Username")}
                            error={!!errors.Username}
                            helperText={errors.Username?.message}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            {...register("Email")}
                            error={!!errors.Email}
                            helperText={errors.Email?.message}
                        />
                        <TextField fullWidth label="Phone number" variant="outlined" margin="normal" {...register("PhoneNumber")} />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            margin="normal"
                            {...register("Password")}
                            error={!!errors.Password}
                            helperText={errors.Password?.message}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account?{" "}
                            <Link component={RouterLink} to="/login" sx={{ color: "primary.main" }}>
                                Login
                            </Link>
                        </Typography>
                        <Button variant="contained" className="btn-primary" fullWidth sx={{ mt: 2 }} type="submit">
                            Sign Up
                        </Button>
                    </form>
                </Box>
            </Container>
        </motion.div>
    );
};

export default SignUp;
