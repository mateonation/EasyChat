import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { ChatMember } from './chatmembers/chatmember.entity';
import { User } from '../users/user.entity';
import { NotFoundException } from 'src/errors/notFoundException';
import { ChatResponseDto } from './dto/chat-response.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
        @InjectRepository(ChatMember)
        private readonly memberRepo: Repository<ChatMember>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    // Find chat by ID
    async findById(chatId: number): Promise<ChatResponseDto | null> {
        // Fetch the chat with its members
        const chat = await this.chatRepo.findOne({
            where: { id: chatId },
            relations: ['members', 'members.user', 'members.user.roles'],
        });

        // If chat is not found, return null
        if (!chat) return null;

        return ChatResponseDto.fromChat(chat);
    }

    // Search for an existing individual chat between two users
    async findIndividualChat(
        user1: number,
        user2: number,
    ): Promise<ChatResponseDto | null> {
        // Check for both users in an individual chat
        // Chat is considered individual if it has only two members and 'isGroup' boolean is false
        const select = await this.memberRepo
            .createQueryBuilder('member')
            .innerJoin(Chat, 'chat', 'chat.id = member.chatId')
            .select('member.chatId', 'chatId')
            .where('chat.isGroup = false')
            .andWhere('member.userId IN (:...userIDs)', { userIDs: [user1, user2] })
            .groupBy('member.chatId')
            .having('COUNT(DISTINCT member.userId) = 2')
            .getRawOne();

        // Fetch the chat with its members
        const chat = await this.chatRepo.findOne({
            where: { id: select?.chatId },
            relations: ['members', 'members.user', 'members.user.roles'],
        });

        if (!chat) return null;

        return ChatResponseDto.fromChat(chat);
    }

    // Create chat w/o any members
    // Later, members can be added by a method in ChatMembersService
    async createChat(): Promise<Chat> {
        // Create and save chat in DB
        const chat = this.chatRepo.create({});
        await this.chatRepo.save(chat);
        return chat;
    }
}
