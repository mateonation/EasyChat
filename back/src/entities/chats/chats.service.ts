import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { ChatMember } from '../chatmembers/chatmember.entity';
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
            relations: ['members', 'members.user'],
        });

        if (!chat) return null;

        return ChatResponseDto.fromChat(chat);
    }

    // Create an individual chat between two users
    async createIndividualChat(
        requesterId: number,
        otherUserId: number,
    ): Promise<ChatResponseDto | null> {
        // Check if both users exist
        const requester = await this.userRepo.findOne({ where: { id: requesterId }});
        const otherUser = await this.userRepo.findOne({ where: { id: otherUserId }});

        // If not, throw a NotFoundException
        if (!requester || !otherUser) {
            throw new NotFoundException('One or both users not found.');
        }

        // Save chat and members in the DB
        const newChat = this.chatRepo.create({
            creationDate: new Date(),
        });
        await this.chatRepo.save(newChat);

        // Add both users to the chat as members and save joining date
        const newMembers = [
            this.memberRepo.create({
                userId: requesterId,
                chatId: newChat.id,
                role: 'member',
                joinDate: new Date(),
            }),
            this.memberRepo.create({
                userId: otherUserId,
                chatId: newChat.id,
                role: 'member',
                joinDate: new Date(),
            }),
        ]

        await this.memberRepo.save(newMembers);

        // Fetch the chat with its members
        const chat = await this.chatRepo.findOne({
            where: { id: newChat?.id },
            relations: ['members', 'members.user'],
        });

        if (!chat) return null;

        return ChatResponseDto.fromChat(chat);
    }
}
