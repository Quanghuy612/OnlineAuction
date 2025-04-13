import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const URL = "https://localhost:5001/api/v1/";
const API = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const noAuthRoutes = ["auth/login", "auth/signup", "auth/refresh-token"];

API.interceptors.request.use(
    (config) => {
        const token = cookies.get("token");

        if (noAuthRoutes.some((route) => config.url?.includes(route))) {
            config.withCredentials = false;
            delete config.headers["Authorization"];
        } else if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !noAuthRoutes.some((route) => originalRequest.url?.includes(route))) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    URL + "auth/refresh-token",
                    {},
                    {
                        withCredentials: true,
                    }
                );
                if (res.data.success) {
                    cookies.set("token", res.data.data.Token, { path: "/" });
                    cookies.set("refreshToken", res.data.data.RefreshToken, { path: "/" });

                    return API(originalRequest);
                } else {
                    cookies.remove("token");
                    cookies.remove("refreshToken");
                }
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                cookies.remove("token");
                cookies.remove("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
