import { Backdrop, CircularProgress } from "@mui/material";
import { useApi } from "../store/useApi";

const LoadingSpinner = () => {
    const { loading } = useApi();

    return (
        <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingSpinner;
