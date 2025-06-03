import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    ) {}

    // Send message to a chat
    async sendMessage(
        dto: SendMessageDto,
        senderId: number,
    ): Promise<MessageResponseDto | null> {
        const message = this.messageRepo.create({
            content: dto.content,
            chat: { id: dto.chatId },
            user: { id: senderId },
        });

        // Save message into DB
        const messageSaved = await this.messageRepo.save(message);

        // Reload message with user relationship
        const messageFromBD = await this.messageRepo.findOne({
            where: { id: messageSaved.id },
            relations: ['user'],
        });
        if (!messageFromBD) return null;
        return MessageResponseDto.fromMessage(messageFromBD);
    }

    // Send a system message to a chat
    async sendSystemMessage(
        chatId: number,
        systemType: string,
        params: Record<string, string>,
    ): Promise<MessageResponseDto> {
        const content = SystemMessageService.getMessage(systemType, params);

        const message = this.messageRepo.create({
            user: undefined, // User is undefined for system messages
            chat: { id: chatId }, // Chat id where the message will be sent
            content, // Content of the message
            type: MessageType.SYSTEM, // Type of the message (system)
        });

        // Save message into DB
        await this.messageRepo.save(message);

        return MessageResponseDto.fromMessage(message);
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
        page: number = 1,
        limit: number = 100,
    ): Promise<PaginatedMessagesResponseDto> {
        // Count how many messages are in the chat
        const totalMessages = await this.messageRepo.count({
            where: { chat: { id: chatId } },
        });

        // Calculate how many messages to skip
        const totalPages = Math.ceil(totalMessages / limit);
        const currPage = Math.min(page, totalPages); // Ensure current page does not exceed total pages
        const skip = Math.max(totalMessages - currPage * limit, 0);

        // Get messages ordered by sentDate in ascending order
        const messages = await this.messageRepo.find({
            where: { chat: { id: chatId } },
            order: { sentDate: 'ASC' }, 
            skip,
            take: limit,
            relations: ['user'],
        });

        const messageDtos = messages.map((msg) => new MessageResponseDto(msg));
        const hasMore = skip > 0;

        return PaginatedMessagesResponseDto.from(messageDtos, totalMessages, hasMore);
    }
}
