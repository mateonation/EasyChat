import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from '../chatmembers/chatmember.entity';
import { Chat } from '../chats/chat.entity';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { ForbiddenException } from 'src/errors/forbiddenException';

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

    async sendMessage(senderId: number, dto: SendMessageDto): Promise<Message> {
        // Check if the user is member of the chat
        const member = await this.memberRepo.findOne({ 
            where: { chat: { id: dto.chatId }, user: { id: senderId } }, 
        });

        // If the user is not a member of the chat, throw an error
        if (!member) {
            throw new ForbiddenException('You are not a member of this chat');
        }

        // Create a new message
        const message = this.messageRepo.create({
            content: dto.content,
            chatId: dto.chatId,
            senderId,
        });

        // Save message into DB
        await this.messageRepo.save(message);

        return message;
    }
}
