import { createContext, useContext, useEffect, useState } from "react";
import { login, logout } from "../api/auth";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return;

        api.post("/api/token/refresh/", { refresh })
            .then(res => {
                setAccessToken(res.data.access);
                setIsAuthenticated(true);
            })
            .catch(() => {
                localStorage.removeItem("refresh");
            });
    }, []);

    const loginUser = async (email, password) => {
        try {
            const res = await login(email, password);
            setIsAuthenticated(true);
            return { success: true, status: res.status, data: res.data };
        }
        catch (err) {
            return { success: false, status: err.response?.status || 500, message: err.response?.data || err.message };
        }
    };

    const logoutUser = () => {
        logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
