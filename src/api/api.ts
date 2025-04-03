import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const API = axios.create({
    baseURL: "https://api.example.com/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

API.interceptors.request.use(
    (config) => {
        const token = cookies.get("token");

        const noAuthRoutes = ["/login", "/signup"];

        if (noAuthRoutes.some((route) => config.url?.includes(route))) {
            config.withCredentials = false;
            delete config.headers["Authorization"];
        } else if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
