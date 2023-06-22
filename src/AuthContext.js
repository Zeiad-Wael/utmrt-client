import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        token: null,
        user: {
            id: null,
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            matricNumber: null,
            phone: null,
            gender: null,
            profileImage: null,
            currentRide: null,
            isApply: null,
        },
    });
    

    useEffect(() => {
        const storedAuthData = localStorage.getItem('authData');
        if (storedAuthData) {
            setAuthData(JSON.parse(storedAuthData));
        }
    }, []);

    const updateAuthData = (data) => {
        setAuthData(data);
        if (data) {
            localStorage.setItem('authData', JSON.stringify(data));
        } else {
            localStorage.removeItem('authData');
        }
    };

    return (
        <AuthContext.Provider value={{ authData, setAuthData: updateAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};
