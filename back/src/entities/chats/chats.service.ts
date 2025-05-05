import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { ChatMember } from '../chatmembers/chatmember.entity';
import { User } from '../users/user.entity';

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

    // Create an individual chat between two users
    async createIndividualChat(
        requesterId: number,
        otherUserId: number,
    ): Promise<Chat> {
        // Search for an existing individual chat between the two users
        const existingChats = this.chatRepo.find({
            relations: ['members', 'members.user'],
        });

        // If it exists, return it
        for (const chat of await existingChats) {
            const members = chat.members.map(m => m.user.id);
            if (members.includes(requesterId) && members.includes(otherUserId) && !chat.isGroup) {
                return chat; // Return the existing chat if found
            }
        }

        // If it doesn't exist, create it
        const newChat = this.chatRepo.create({
            creationDate: new Date(),
            isGroup: false,
        });
        await this.chatRepo.save(newChat);

        // Add the two users to the chat as members and save the join date
        const requester = await this.userRepo.findOneByOrFail({ id: requesterId });
        const otherUser = await this.userRepo.findOneByOrFail({ id: otherUserId });

        const members = [
            this.memberRepo.create({
                user: requester,
                chat: newChat,
                role: 'member',
                joinDate: new Date(),
            }),
            this.memberRepo.create({
                user: otherUser,
                chat: newChat,
                role: 'member',
                joinDate: new Date(),
            }),
        ]
        await this.memberRepo.save(members);

        return newChat;
    }
}
