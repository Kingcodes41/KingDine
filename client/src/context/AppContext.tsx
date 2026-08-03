/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
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
    // register: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<boolean>;
    register: (userData: { name: string; email: string; password: string; phone?: string; role?: string; }) => Promise<boolean>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   
    const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setLoading(true);
    
    // Fixed space after '=' and ensured proper arguments formatting
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const { token: userToken, ...userData } = res.data;

    localStorage.setItem("token", userToken);
    setToken(userToken);
    setUser(userData);
    setIsAuthenticated(true);
    toast.success(`Welcome back, ${userData.name}`);
    return true;

  } catch (error: any) {
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
    
    // Pass the object directly to the backend API
    const res = await api.post("/auth/register", userData);

    const { token: userToken, ...userDataReceived } = res.data;

    localStorage.setItem("token", userToken);
    setToken(userToken);
    setUser(userDataReceived);
    setIsAuthenticated(true);
    toast.success(`Welcome to KingDine Club!`);
    return true;

  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Error occurred");
    return false;
  } finally {
    setLoading(false);
  }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
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
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
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
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};
