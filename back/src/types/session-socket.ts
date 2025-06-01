import { Socket } from 'socket.io';
import { Session } from 'express-session';
import { IncomingMessage } from 'http';

interface AuthenticatedSession extends Session {
    user?: {
        id: number;
        username: string;
    };
}

export interface SessionSocket extends Socket {
    request: IncomingMessage & {
        session: AuthenticatedSession;
    };
}