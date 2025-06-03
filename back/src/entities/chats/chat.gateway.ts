import {
    ConnectedSocket,
    MessageBody, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer 
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SessionSocket } from "src/types/session-socket";
import { MessageResponseWithChatId } from "../messages/dto/message-response-chatId.dto";

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
    },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: SessionSocket) {
        const user = client.handshake.auth;
        if(!user) {
            client.disconnect();
            return;
        }
        console.log(`[ChatGateway] ${user.username} connected`);
    }

    handleDisconnect(client: SessionSocket) {
        const user = client.request.session?.user;
        if (user) console.log(`[ChatGateway] ${user.username} disconnected`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() dto: MessageResponseWithChatId,
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.handshake.auth;
        const chat = dto.chatId.toString();
        if(!user || !chat) {
            return;
        }

        this.server.to(`chat_${chat}`).emit('newMessage', dto.message);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() chatId: number, 
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.handshake.auth;
        const chat = chatId?.toString();
        if (!chat || !user){
            return;
        } 

        client.join(`chat_${chat}`);
    }

    @SubscribeMessage('leaveChat')
    handleLeaveChat(
        @MessageBody() chatId: number, 
        @ConnectedSocket() client: SessionSocket,
    ) {
        const chat = chatId?.toString();
        if (!chat) return;

        client.leave(`chat_${chat}`);
    }
}