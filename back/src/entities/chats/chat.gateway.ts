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
        origin: true,
        credentials: true,
    },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: SessionSocket) {
        const user = client.request.session?.user;
        if(!user) {
            client.disconnect();
            return;
        }
        console.log(`User connected: ${user.username}`);
    }

    handleDisconnect(client: SessionSocket) {
        const user = client.request.session?.user;
        if (user) console.log(`User disconnected: ${user.username}`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() message: MessageResponseDto,
        @ConnectedSocket() client: SessionSocket,
    ) {
        const user = client.request.session?.user;
        if (!user) return;

        if (!user || !message || !message.chatId || !message.content) return;
        
        this.server.to(`chat_${message.chatId}`).emit('newMessage', message);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() chatId: number, 
        client: SessionSocket,
    ) {
        client.join(`chat_${chatId}`);
    }
}