import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import api from "../lib/axios";

function useAuthReq() {
    const {isSignedIn, isLoaded, getToken} = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            if (!isSignedIn) {
                delete config.headers?.Authorization;
                return config;
            }

            try {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    delete config.headers?.Authorization;
                }
            } catch (error) {
                console.error("Failed to get Clerk token:", error);
                delete config.headers?.Authorization;
            }

            return config;
        });

        return () => api.interceptors.request.eject(interceptor);
    }, [getToken, isSignedIn]);

    return {isSignedIn, isClerkLoaded: isLoaded}
}

export default useAuthReq
