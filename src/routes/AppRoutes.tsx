import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import Error from "../pages/error/Error";
//import ProtectedRoutes from "../components/ProtectedRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* <Route element={<ProtectedRoutes />}>
                    <Route index element={<Home />} />
                </Route> */}
                <Route index element={<Home />} />
                <Route path="*" element={<Error />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
        </Routes>
    );
};

export default AppRoutes;
