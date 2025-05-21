import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from '../chats/chatmembers/chatmember.entity';
import { Chat } from '../chats/chat.entity';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { PaginatedMessagesResponseDto } from './dto/paginated-messages-response.dto';
import { MessageType } from 'src/common/enums/message-type.enum';
import { SystemMessageService } from 'src/common/system_messages/system_message.service';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
    
        @InjectRepository(Chat)
        private chatRepo: Repository<Chat>,
    
        @InjectRepository(ChatMember)
        private memberRepo: Repository<ChatMember>,
    ) {}

    // Send message to a chat
    async sendMessage(
        dto: SendMessageDto,
        senderId: number,
    ): Promise<Message> {
        const message = this.messageRepo.create({
            content: dto.content,
            chat: { id: dto.chatId },
            user: { id: senderId },
        });

        // Save message into DB
        await this.messageRepo.save(message);

        return message;
    }

    // Send a system message to a chat
    async sendSystemMessage(
        chatId: number,
        systemType: string,
        params: Record<string, string>,
    ): Promise<Message> {
        const content = SystemMessageService.getMessage(systemType, params);

        const message = this.messageRepo.create({
            user: undefined, // User is undefined for system messages
            chat: { id: chatId }, // Chat id where the message will be sent
            content, // Content of the message
            type: MessageType.SYSTEM, // Type of the message (system)
        });

        // Save message into DB
        await this.messageRepo.save(message);

        return message;
    }

    // Find a message by it's ID
    async findById(messageId: number): Promise<Message | null> {
        const message = await this.messageRepo.findOne({ where: { id: messageId } });
        if (!message) return null;
        return message;
    }

    // Delete a message by it's ID
    // This method DOES NOT delete a message entirely, but rather marks it as deleted
    // by setting the 'isDeleted' field to true
    async deleteMessage(messageId: number): Promise<boolean> {
        const message = await this.messageRepo.findOne({ where: { id: messageId } });
        await this.messageRepo.update(messageId, { isDeleted: true });
        return true;
    }

    // Find messages by chat ID
    async findMessagesByChatId(
        chatId: number,
        offset = 0,
        limit = 100
    ): Promise<PaginatedMessagesResponseDto> {

        // Count total number of messages sent to a chat
        const totalMessages = await this.messageRepo.count({
            where: { chat: { id: chatId } },
        });
        
        // Paginated query
        const messages = await this.messageRepo.find({
            where: { chat: { id: chatId } },
            relations: ['user'],
            order: { sentDate: 'DESC' },
            // Pagination
            skip: offset,
            take: limit,
        });

        const messageDtos = MessageResponseDto.fromMessages(messages);
        return PaginatedMessagesResponseDto.from(messageDtos, totalMessages, offset, limit);
    }
}
