import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { ChatMember } from './chatmembers/chatmember.entity';
import { User } from '../users/user.entity';
import { NotFoundException } from 'src/errors/notFoundException';
import { ChatResponseDto } from './dto/chat-response.dto';
import { CreateChatDto } from './dto/create-chat.dto';

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

    // Function that updates chat properties
    async updateChat(
        chatId: number,
        chatData: Partial<CreateChatDto>,
    ): Promise<Chat | null> {
        // Get the chat by ID
        const chat = await this.chatRepo.findOne({ where: { id: chatId } });

        // If chat is not found, throw an error
        if (!chat) return null;

        // Update the chat properties
        chat.name = chatData.name || chat.name; // Update name if provided
        chat.groupDescription = chatData.groupDescription || chat.groupDescription; // Update description if provided
        // Set the chat as a group chat if it is not already
        if (!chat.isGroup) {
            chat.isGroup = true;
        }

        // Save the updated chat to the database
        await this.chatRepo.save(chat);

        return chat;
    }

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
        // Check if both users are actual members of an already existing individual chat
        // This query builder only returns an existing individual chat where both users are already members
        // It checks for the following:
        // 1. The chat is not a group chat (isGroup = false)
        // 2. Both users are members of the chat
        // 3. The chat has exactly two members (the two users)
        const select = await this.chatRepo
            .createQueryBuilder('chat')
            .innerJoin('chat.members', 'member')
            .select('chat.id', 'chatId')
            .where('chat.isGroup = false')
            .andWhere('member.userId IN (:...userIDs)', { userIDs: [user1, user2] })
            .groupBy('chat.id')
            .having('COUNT(DISTINCT member.userId) = 2')
            .andHaving('COUNT(*) = 2')
            .getRawOne();

        // If no chat is found, return null
        if (!select) return null;

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
