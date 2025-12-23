import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const syncCurrentUser = async () => {
        const storedUser = authService.getCurrentUser();
        if (!storedUser) {
            return;
        }
        setCurrentUser(storedUser);
        try {
            const profile = await userService.getCurrentUserProfile();
            const mergedUser = { ...storedUser, ...profile, token: storedUser.token };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            setCurrentUser(mergedUser);
        } catch {}
    };

    useEffect(() => {
        void syncCurrentUser();
    }, []);

    const register = async (username, email, password) => {
        try {
            const response = await authService.register(username, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const user = await authService.login(email, password);
            setCurrentUser(user);
            await syncCurrentUser();
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
