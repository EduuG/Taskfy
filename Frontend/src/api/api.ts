import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {useLoading} from '../contexts/LoadingContext.tsx';
import React, {useEffect} from "react";
import handleError from "../utils/handleError.ts";

const apiUrl = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
});

interface AxiosInterceptorProps {
    children: React.ReactNode;
}

interface InternalAxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({children}) => {
    const {setIsLoading} = useLoading();

    const reqResInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        setIsLoading(true);
        return config;
    }

    const reqErrInterceptor = async (error: AxiosError) => Promise.reject(error);

    const resResInterceptor = (response: AxiosResponse): AxiosResponse => {
        setIsLoading(false);
        return response;
    }

    const ResErrInterceptor = async (error: AxiosError): Promise<AxiosError> => {
        setIsLoading(false);
        const originalRequest = error.config as InternalAxiosRequestConfigWithRetry;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken();
                return api(originalRequest);
            } catch (error: unknown) {
                handleError(error);
            }
        }

        return Promise.reject(error);
    }

    useEffect(() => {
        const reqInterceptorId = api.interceptors.request.use(reqResInterceptor, reqErrInterceptor);
        const resInterceptorId = api.interceptors.response.use(resResInterceptor, ResErrInterceptor);

        return () => {
            api.interceptors.request.eject(reqInterceptorId);
            api.interceptors.response.eject(resInterceptorId);
        };
    }, [])

    return children;
}

const refreshToken = async (): Promise<string | null> => {
    try {
        const response = await api.post("/Token/RefreshToken", {withCredentials: true});
        return response.data;
    } catch (error) {
        return null;
    }
}

export default api;
export {AxiosInterceptor};