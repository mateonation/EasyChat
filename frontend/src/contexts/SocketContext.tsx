import { createContext, useEffect, useContext, useRef, } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io("http://localhost:3000", {
            withCredentials: true, // permite el uso de cookies para sesiones
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={ socketRef.current }>
            {children}
        </SocketContext.Provider>
    );
};