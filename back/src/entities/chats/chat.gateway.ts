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
        const user = client.handshake.auth;
        if(!user) {
            console.log('[ChatGateway] User not authenticated, disconnecting socket...');
            client.disconnect();
            return;
        }
        console.log(`[ChatGateway] User ${user.username} is connected (${client.id})`);
    }

    handleDisconnect(client: SessionSocket) {
        const user = client.request.session?.user;
        if (user) console.log(`[ChatGateway] User ${user.username} is now disconnected (${client.id})`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() message: MessageResponseDto,
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.handshake.auth;
        const chat = message.chatId?.toString();
        if(!user || !chat) {
            console.log('[ChatGateway] Message from unauthenticated user or w/o userId');
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
        const user = client.handshake.auth;
        const chat = chatId?.toString();
        if (!chat || !user){
            console.log('[ChatGateway] Join request from unauthenticated user or w/o chatId');
            return;
        } 

        client.join(chat);
        console.log(`[ChatGateway] ${user.username} has joined chat ${chat}`);
    }

    @SubscribeMessage('leaveChat')
    handleLeaveChat(
        @MessageBody() chatId: number, 
        @ConnectedSocket() client: SessionSocket,
    ) {
        const chat = chatId?.toString();
        if (!chat) return;

        client.leave(chat);
        console.log(`[ChatGateway] ${client.id} left chat ${chat}`);
    }
}