import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import Error from "../pages/error/Error";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AuctionLayout from "../layout/AuctionLayout";
import AuthLayout from "../layout/AuthLayout";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<AuctionLayout />}>
                    <Route element={<ProtectedRoutes />}>
                        <Route index element={<Home />} />
                    </Route>
                </Route>
                <Route path="/" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                </Route>
            </Route>
            <Route path="*" element={<Error />} />
        </Routes>
    );
};

export default AppRoutes;
