import { create } from "zustand";
import API from "../api/api";
import { AxiosError } from "axios";

interface ApiState<T = unknown> {
    data: T | null;
    total: number;
    loading: boolean;
    success: boolean;
    message: string | null;
    apiCall: <T = unknown>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        params?: Record<string, unknown>,
        body?: unknown
    ) => Promise<{
        success: boolean;
        message: string;
        data: T | null;
        total?: number;
    }>;
}

export const useApi = create<ApiState>((set) => ({
    data: null,
    total: 0,
    loading: false,
    success: false,
    message: null,
    apiCall: async <T = unknown>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        endpoint: string,
        params?: Record<string, unknown>,
        body?: unknown
    ): Promise<{
        success: boolean;
        message: string;
        data: T | null;
        total?: number;
    }> => {
        set({ loading: true, message: null, success: false });

        try {
            const response = await API({
                method,
                url: endpoint,
                params: method === "GET" ? params : undefined,
                data: method !== "GET" ? body : undefined,
            });

            const { success, message, data, total } = response.data;

            set({
                data: data || null,
                total: total || 0,
                success: success ?? false,
                message: message || "",
                loading: false,
            });

            return {
                success,
                message,
                data: (data as T) ?? null,
                total,
            };
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred";

            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            }

            set({
                loading: false,
                success: false,
                message: errorMessage,
            });

            return {
                success: false,
                message: errorMessage,
                data: null,
            };
        }
    },
}));
