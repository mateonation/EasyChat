import { createContext, useState, useEffect, useContext, } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from './AuthContext';

type SocketContextType = {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthContext();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user) {
            socket?.disconnect();
            setSocket(null);
            return;
        }

        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
            withCredentials: true,
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);