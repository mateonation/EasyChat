import { createContext, useEffect, useContext, useRef, useState, } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAuthContext();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if(!user || isConnected) return;

        const socket = io("http://localhost:3000", {
            withCredentials: true, // permite el uso de cookies para sesiones
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            setIsConnected(false);
        };
    }, [user, isConnected]);

    return (
        <SocketContext.Provider value={ socketRef.current }>
            {children}
        </SocketContext.Provider>
    );
};