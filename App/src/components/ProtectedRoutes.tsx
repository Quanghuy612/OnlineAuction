import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProtectedRoutes: React.FC = () => {
    const [cookies] = useCookies(["token"]);
    const location = useLocation();

    return cookies.token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoutes;
