import axios from 'axios';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import auth from '../api/auth.ts';
import { User } from '../types/userdata.dto.ts';
import { io, Socket } from 'socket.io-client';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    socket: Socket | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login() { return Promise.resolve(); },
    logout() { return Promise.resolve(); },
    socket: null,
});

export const AuthProvider = ({children}: PropsWithChildren<object>) => {
    const [user, setUser] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(user != null) return;
        const stored = localStorage.getItem("user");
        if(!stored) return;
        setUser(JSON.parse(stored));
    }, [user, setUser]);

    const login = async (email: string, password: string) => {
        try{
            const result = await auth.post<{user: User}>('/login', { email, password });
            updateSession(result.data.user);
            // Initialize socket connection after successful login
            const newSocket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true, });
            setSocket(newSocket);
        } catch (error) {
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data.message); // Send message of the response to the component
            }
            throw new Error('Server error');
        }
    }

    const logout = async () => {
        try {
            await auth.post('/logout');
            updateSession(null);
            // Disconnect socket if it exists
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        } catch (error) {
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data.message); // Send message of the response to the component
            }
            throw new Error('Server error');
        }
    }

    const updateSession = async (user: User | null) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        if (user === null) localStorage.removeItem("user");
    };

    return <AuthContext.Provider value={{ user, login, logout, socket }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
