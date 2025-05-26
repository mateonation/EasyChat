import { createContext, PropsWithChildren, useState, useRef, useEffect, useContext, } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
});

export const SocketProvider = ({ children }: PropsWithChildren) => {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            setConnected(false);
            console.log('Socket disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);