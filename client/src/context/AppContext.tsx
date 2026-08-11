/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";
import toast from "react-hot-toast";

interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin" | "owner";
}

interface AppContextType {
    user: UserType | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<boolean>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const getStoredToken = () => {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("token");
};

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(getStoredToken()));

    const clearAuthState = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }

        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            clearAuthState();

            const res = await api.post("/auth/login", {
                email,
                password,
            });

            const { token: userToken, ...userData } = res.data as {
                token: string;
                _id: string;
                name: string;
                email: string;
                phone?: string;
                role: UserType["role"];
            };

            if (!userToken) {
                throw new Error("Invalid login response");
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("token", userToken);
            }

            setToken(userToken);
            setUser(userData);
            setIsAuthenticated(true);
            toast.success(`Welcome back, ${userData.name}`);
            return true;
        } catch (error: any) {
            clearAuthState();
            toast.error(error?.response?.data?.message || "Error occurred");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        role?: string;
    }): Promise<boolean> => {
        try {
            setLoading(true);
            clearAuthState();

            const res = await api.post("/auth/register", userData);
            const { token: userToken, ...userDataReceived } = res.data as {
                token: string;
                _id: string;
                name: string;
                email: string;
                phone?: string;
                role: UserType["role"];
            };

            if (!userToken) {
                throw new Error("Invalid registration response");
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("token", userToken);
            }

            setToken(userToken);
            setUser(userDataReceived);
            setIsAuthenticated(true);
            toast.success("Welcome to KingDine Club!");
            return true;
        } catch (error: any) {
            clearAuthState();
            toast.error(error?.response?.data?.message || "Error occurred");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuthState();
        window.location.href = "/";
    };

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await api.get("/auth/me");
                setUser(res.data as UserType);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Failed to load user:", error);
                clearAuthState();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const value: AppContextType = {
        user,
        token,
        loading,
        isAuthenticated,
        setIsAuthenticated,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};
