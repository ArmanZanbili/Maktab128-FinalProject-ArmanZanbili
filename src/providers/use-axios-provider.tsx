"use client";

import useAxiosAuth from "../hooks/use-axios-auth";



const AxiosProvider = () => {
    useAxiosAuth();
    return null;
};

export default AxiosProvider;