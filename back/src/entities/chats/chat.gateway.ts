import {
    MessageBody, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer 
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SessionSocket } from "src/types/session-socket";
import { MessagesService } from "../messages/messages.service";
import { SendMessageDto } from "../messages/dto/send-message.dto";

@WebSocketGateway({
    cors: {
        origin: true,
        credentials: true,
    },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly messagesService: MessagesService
    ) { }

    handleConnection(client: SessionSocket) {
        const user = client.request.session.user;
        if(!user) {
            client.disconnect();
            return;
        }
        console.log(`User connected: ${user.username}`);
    }

    handleDisconnect(client: SessionSocket) {
        console.log(`User disconnected: ${client.request.session.user.username}`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody()
        dto: SendMessageDto,
        client: SessionSocket,
    ) {
        const user = client.request.session.user;
        if (!user) return;
        
        try {
            // Save message in DB
            const savedMessage = await this.messagesService.sendMessage(dto, user.id);

            // Then emit the message to the chat
            this.server.to(`chat_${dto.chatId}`).emit('newMessage', savedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() chatId: number, 
        client: SessionSocket,
    ) {
        client.join(`chat_${chatId}`);
    }
}