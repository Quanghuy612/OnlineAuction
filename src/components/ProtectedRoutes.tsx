import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNotify } from "../hooks/useNotify";

const ProtectedRoutes: React.FC = () => {
    const [cookies] = useCookies(["token"]);
    const location = useLocation();
    const { showNotify } = useNotify();

    useEffect(() => {
        if (!cookies.token) {
            showNotify("Unauthorized! Please login first.", "error");
        }
    }, [cookies, showNotify]);

    return cookies.token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoutes;
