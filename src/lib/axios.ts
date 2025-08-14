'use client';

import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.user.accessToken && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const session = await getSession();
                if (!session?.user.refreshToken) {
                    signOut();
                    return Promise.reject(error);
                }

                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`,
                    { refreshToken: session.user.refreshToken }
                );

                const newAccessToken = data.token.accessToken;

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                signOut();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export { axiosInstance };