import { create } from "zustand";
import API from "../api/api";
import { AxiosError } from "axios";

interface ApiState<T = unknown> {
    data: T[];
    total: number;
    loading: boolean;
    error: string | null;
    success: string | null;
    apiCall: (method: "GET" | "POST" | "PUT" | "DELETE", endpoint: string, params?: Record<string, unknown>, body?: unknown) => Promise<void>;
}

export const useApi = create<ApiState>((set) => ({
    data: [],
    total: 0,
    loading: false,
    error: null,
    success: null,

    apiCall: async (method, endpoint, params, body) => {
        set({ loading: true, error: null, success: null });

        try {
            const response = await API({
                method,
                url: endpoint,
                params: method === "GET" ? params : undefined,
                data: method !== "GET" ? body : undefined,
            });

            set({
                data: method === "GET" ? response.data.results || response.data : [],
                total: method === "GET" ? response.data.total || 0 : 0,
                success: response.data.message || response.data.meta?.message || (response.data.success ? "Operation successful!" : ""),
                loading: false,
            });
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                set({
                    error: error.response?.data?.message || "An error occurred",
                    loading: false,
                });
            } else {
                set({ error: "An unknown error occurred", loading: false });
            }
        }
    },
}));
