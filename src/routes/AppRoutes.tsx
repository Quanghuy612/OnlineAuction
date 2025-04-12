import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import Error from "../pages/error/Error";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AdminLayout from "../layout/AdminLayout";
import AuctionLayout from "../layout/AuctionLayout";
import AuthLayout from "../layout/AuthLayout";
import OtherLayout from "../layout/OtherLayout";
import AuctionList from "../pages/admin/AuctionList";
import UserReport from "../pages/admin/AuctionList";
import AuctionReport from "../pages/admin/AuctionList";
import LiveAuction from "../pages/auction/LiveAuction";
import UserAuctions from "../pages/auction/UserAuctions";
import UserProducts from "../pages/product/UserProducts";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<AuctionLayout />}>
                        <Route index element={<Home />} />
                    </Route>
                    <Route element={<OtherLayout />}>
                        <Route path="/user/products/:userId" element={<UserProducts />} />
                        <Route path="/user/auctions/:userId" element={<UserAuctions />} />
                        <Route path="/live-auction/:id" element={<LiveAuction />} />
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="user/:id" element={<UserReport />} />
                        <Route path="auctions/report" element={<AuctionReport />} />
                        <Route path="auctions" element={<AuctionList />} />
                    </Route>
                </Route>
            </Route>
            <Route element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
            </Route>
            <Route path="*" element={<Error />} />
        </Routes>
    );
};

export default AppRoutes;
