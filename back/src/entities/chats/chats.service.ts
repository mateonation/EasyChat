import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { ChatMember } from '../chatmembers/chatmember.entity';
import { User } from '../users/user.entity';
import { NotFoundException } from 'src/errors/notFoundException';

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
        requesterId: number,
        otherUserId: number,
    ): Promise<Chat | null> {
        // Search for an existing individual chat between the two users
        const existingChats = await this.chatRepo.find({
            relations: ['members', 'members.user'],
        });

        // If it exists, return it
        for (const chat of existingChats) {
            const members = chat.members.map(m => m.user.id);
            if (members.includes(requesterId) && members.includes(otherUserId) && !chat.isGroup) {
                return chat; // Return the existing chat if found
            }
        }
        return null; // Return null if no chat is found
    }

    // Create an individual chat between two users
    async createIndividualChat(
        requesterId: number,
        otherUserId: number,
    ): Promise<Chat> {
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

        return newChat;
    }
}
