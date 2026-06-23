import { useCallback, useState } from "react";
import { env } from "../config/env";

export type LoginResponse = {
    success: boolean;
    token: string;
};

export type ApiErrorResponse = {
    success: false;
    message?: string;
};

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);

    const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        try {
            setIsLoading(true);
            const baseUrl = env.VITE_API_URL;

            if (!baseUrl) {
                throw new Error("VITE_API_URL manquante");
            }

            const token = localStorage.getItem("token");

            const isFormData = options.body instanceof FormData;

            const headers = {
                ...(!isFormData && { "Content-Type": "application/json" }),
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            }

            const response = await fetch(baseUrl + endpoint, {
                ...options,
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur serveur");
            }

            if (response.status === 204) {
                return null;
            }

            return response.json();
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { apiFetch, isLoading };
}

export default useFetch;
