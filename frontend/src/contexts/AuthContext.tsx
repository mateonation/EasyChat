import axios from 'axios';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import auth from '../api/auth.ts';
import { User } from '../types/userdata.dto.ts';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login() { return Promise.resolve(); },
    logout() { return Promise.resolve(); },
});

export const AuthProvider = ({children}: PropsWithChildren<object>) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if(user != null) return;
        const stored = localStorage.getItem("user");
        if(!stored) return;
        setUser(JSON.parse(stored));
    }, [user, setUser]);

    const login = async (username: string, password: string) => {
        try{
            const result = await auth.post<{user: User}>('/login', { username, password });
            updateSession(result.data.user);
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

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
