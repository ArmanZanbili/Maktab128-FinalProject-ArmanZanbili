"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

const useAxiosAuth = () => {
    const { data: session, update } = useSession();

    useEffect(() => {
        const requestIntercept = axiosInstance.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${session?.user.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?._retry) {
                    prevRequest._retry = true;

                    try {
                        if (!session?.user.refreshToken) {
                            await signOut({ redirect: false });
                            return Promise.reject(error);
                        }

                        const res = await axios.post(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`,
                            { refreshToken: session.user.refreshToken }
                        );

                        const newAccessToken = res.data.token.accessToken;

                        await update({
                            ...session,
                            user: {
                                ...session.user,
                                accessToken: newAccessToken,
                            },
                        });

                        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosInstance(prevRequest);

                    } catch (refreshError) {
                        console.error("Token refresh failed, signing out.", refreshError);
                        await signOut({ redirect: false });
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        };
    }, [session?.user?.accessToken, session?.user?.refreshToken, update]);

    return axiosInstance;
};

export default useAxiosAuth;