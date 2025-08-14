import axios from 'axios';

const axiosServerInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export { axiosServerInstance };