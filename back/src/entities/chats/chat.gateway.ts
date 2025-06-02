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
import { MessageResponseDto } from "../messages/dto/message-response.dto";

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
        const user = client.request.session?.user;
        if(!user) {
            console.log('[ChatGateway] User not authenticated, disconnecting socket...');
            client.disconnect();
            return;
        }

        console.log(`User connected: ${user.username}`);
    }

    handleDisconnect(client: SessionSocket) {
        const user = client.request.session?.user;
        if (user) console.log(`[ChatGateway] Disconnected: ${user.username}`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() message: MessageResponseDto,
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.request.session?.user;
        const chat = message.chatId?.toString();
        if(!chat || !user) {
            console.warn('[ChatGateway] sendMessage: invalid user or chatId');
            return;
        }

        this.server.to(chat).emit('newMessage', message);
        console.log(`[ChatGateway] ${user.username} sent message to chat ${chat}`);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() chatId: number, 
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.request.session?.user;
        const chat = chatId?.toString();
        if (!user || !chat) return;

        client.join(chat);
        console.log(`[ChatGateway] ${user.username} joined chat ${chat}`);
    }

    @SubscribeMessage('leaveChat')
    handleLeaveChat(
        @MessageBody() chatId: number, 
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.request.session?.user;
        const chat = chatId?.toString();
        if (!user || !chat) return;

        client.leave(chat);
        console.log(`[ChatGateway] ${user.username} left chat ${chat}`);
    }
}