import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
    },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const session = client.request?.session;
        if(!session?.user) {
            client.disconnect();
            return;
        }
        console.log(`Client connected: ${client.id}, User id: ${session.user.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendAMessage')
    handleSendAMessage(
        @MessageBody() payload: { 
            chatId: number, 
            message: string, 
        },
        @ConnectedSocket() client: Socket,
    ) {
        const username = client.request?.session?.user?.username;
        this.server.to(String(payload.chatId)).emit('messageReceived', {
            username,
            message: payload.message,
        });
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() chatId: number, 
        @ConnectedSocket() client: Socket
    ) {
        client.join(String(chatId));
    }
}