import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import api from "../lib/axios";

function useAuthReq() {
    const {isSignedIn, isLoaded, getToken} = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            if (isSignedIn) {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }
        });

        return () => api.interceptors.request.eject(interceptor);
    }, [isSignedIn, isLoaded]);

    return {isSignedIn, isClerkLoaded: isLoaded}
}

export default useAuthReq