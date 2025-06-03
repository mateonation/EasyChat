import axios from 'axios';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import auth from '../api/auth.ts';
import { User } from '../types/userdata.dto.ts';

interface AuthContextType {
    user: User | null;
    isAuthReady: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthReady: false,
    login() { return Promise.resolve(); },
    logout() { return Promise.resolve(); },
});

export const AuthProvider = ({ children }: PropsWithChildren<object>) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        setIsAuthReady(true); // Set to true after checking localStorage
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const result = await auth.post<{ user: User }>('/login', { username, password });
            updateSession(result.data.user); // Activate effect in SocketContext
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message); // Send message of the response to the component
            }
            throw new Error('Server error');
        }
    }

    const logout = async () => {
        try {
            await auth.post('/logout');
            updateSession(null);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message); // Send message of the response to the component
            }
            throw new Error('Server error');
        }
    }

    const updateSession = async (user: User | null) => {
        setUser(user);
        if(user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    };

    return <AuthContext.Provider value={{ user, login, logout, isAuthReady }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
