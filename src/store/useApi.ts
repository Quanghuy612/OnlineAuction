import { create } from "zustand";
import API from "../api/api";
import { AxiosError } from "axios";

interface ApiState<T = unknown> {
    data: T | T[] | null;
    total: number;
    loading: boolean;
    error: string | null;
    success: string | null;
    apiCall: (
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        params?: Record<string, unknown>,
        body?: unknown
    ) => Promise<{
        success: boolean;
        data?: unknown;
        error?: string;
        message?: string;
    }>;
}

export const useApi = create<ApiState>((set) => ({
    data: null,
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

            const responseData = method === "GET" ? response.data.results || response.data : response.data.data || response.data || null;

            const message = response.data.message || response.data.meta?.message || (response.data.success ? "Operation successful!" : "");

            set({
                data: responseData,
                total: method === "GET" ? response.data.total || 0 : 0,
                success: message,
                loading: false,
            });

            return {
                success: true,
                data: responseData,
                message,
            };
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred";

            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            }

            set({
                error: errorMessage,
                loading: false,
            });

            return {
                success: false,
                error: errorMessage,
            };
        }
    },
}));
