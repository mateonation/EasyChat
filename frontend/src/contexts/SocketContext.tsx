import { createContext, useEffect, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthReady } = useAuthContext();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(!isAuthReady) return; // Wait until auth is ready before initializing socket
        if (!user) return; // Don't create socket if user's not logged in

        const socket = io("http://localhost:3000", {
            auth: user,
            withCredentials: true,
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, [isAuthReady, user]); // Listen for changes in user and connected state

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);