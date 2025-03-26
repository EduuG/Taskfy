import React, {createContext, useContext, useEffect, useState} from "react";
import api from "../api/api.ts";
import IUser from "../interfaces/IUser.ts";
import axios, {AxiosResponse} from "axios";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";

interface UserContextProps {
    isAuthenticated: boolean | null;
    isTryingOut: boolean;
    isRegistering: boolean;
    userData: IUser | null;
    register: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    tryWithoutLogin: () => void;
    sendResetPasswordEmail: (email: string) => Promise<void>;
    resetPassword: (password: string) => Promise<void>;
    validateResetPasswordToken: (token: string) => Promise<boolean>;
    isUserLoading: boolean;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isTryingOut, setIsTryingOut] = useState<boolean>(false);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const getAuth = async (): Promise<boolean> => {
            try {
                const response: AxiosResponse<boolean> = await api.get("/User/GetStatus");
                setIsAuthenticated(response.data);
                return response.data;
            } catch {
                setIsAuthenticated(false);
                return false;
            } finally {
                setIsUserLoading(false);
            }
        };

        getAuth();
    }, []);

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (isAuthenticated) {
                    const response = await api.get("/User/GetData");

                    const data = response.data;

                    const user: IUser = {
                        Id: data.id,
                        Name: data.name,
                        Email: data.email,
                    }

                    setUserData(user);
                }
            } catch {
                setUserData(null);
            }
        }

        getUserData();
    }, [isAuthenticated]);

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await api.post("/User/Register", {
                name: name,
                email: email,
                password: password,
            });

            await login(email, password);
            setIsRegistering(true)
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.mensagem);
            }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post("/User/Login", {
                email: email,
                password: password,
            });

            setIsTryingOut(false);
            setIsAuthenticated(true);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.mensagem);
            }
        }
    }

    const logout = async () => {
        if (isAuthenticated) {
            try {
                const response = await api.post("/User/Logout");

                setIsAuthenticated(false);
                setIsTryingOut(false);
                setUserData(null);
                return response.data;
            } catch (error) {
                throw new Error("Ocorreu um erro ao fazer logout: " + error);
            }
        }

        navigate("/Login");
    }

    const tryWithoutLogin = async () => {
        setIsTryingOut(true);
        navigate("/");
    }

    const sendResetPasswordEmail = async (email: string) => {
        try {
            const response = await api.post("/User/ForgotPassword", {
                Email: email,
            });

            return response.data;
        } catch (error) {
            throw new Error("Ocorreu um erro ao enviar e-mail");
        }
    }

    const resetPassword = async (newPassword: string) => {
        const token = searchParams.get("token");

        try {
            const response = await api.post(`/User/ResetPassword?token=${token}`, {
                NewPassword: newPassword,
            });

            return response.data;
        } catch (error) {
            throw new Error("Ocorreu um erro ao redefinir a senha: " + error);
        }
    }

    const validateResetPasswordToken = async (token: string): Promise<boolean> => {
        try {
            const response: AxiosResponse<boolean> = await api.get(`/Token/ValidateResetPasswordToken?token=${token}`);
            return response.data;
        } catch (error) {
            throw new Error("Ocorreu um erro ao validar token: " + error);
        }
    }

    return (
        <UserContext.Provider value={{
            isAuthenticated: isAuthenticated,
            isTryingOut: isTryingOut,
            isRegistering: isRegistering,
            userData: userData,
            register,
            login,
            logout,
            tryWithoutLogin,
            sendResetPasswordEmail,
            resetPassword,
            validateResetPasswordToken,
            isUserLoading
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error()
    }

    return context;
}
