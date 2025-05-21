import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ChatMember } from './chatmember.entity';
import { Chat } from '../../chats/chat.entity';
import { User } from '../../users/user.entity';
import { ChatMemberRole } from 'src/common/enums/chat-members-roles.enum';

@Injectable()
export class ChatmembersService {
    constructor(
        @InjectRepository(ChatMember)
        private readonly memberRepo: Repository<ChatMember>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
    ) { }

    // Function to get a member from a chat
    // This is needed to check if a user is a member of a chat
    // It DOES NOT RETURN the chat id or user id
    // It only returns the member object
    async findChatMember(
        userId: number,
        chatId: number,
    ): Promise<ChatMember | null> {
        const user = this.memberRepo.findOne({
            where: { user: { id: userId }, chat: { id: chatId } },
        });
        if (!user) return null;
        return user;
    }

    // Function to add a user to a chat
    async addUserToChat(
        userId: number,
        chatId: number,
    ): Promise<void> {
        const member = this.memberRepo.create({
            user: { id: userId },
            chat: { id: chatId },
        });
        await this.memberRepo.save(member);
    }

    // Function to update the role of a user in a chat
    async updateMemberRole(
        userId: number,
        chatId: number,
        role: ChatMemberRole,
    ): Promise<void> {
        const member = await this.memberRepo.findOne({ where: { user: { id: userId }, chat: { id: chatId } } });
        if (!member) return;
        member.role = role;
        await this.memberRepo.save(member);
    }

    // Function to remove a user from a chat
    async removeUserFromChat(
        userId: number,
        chatId: number,
    ): Promise<void> {
        const member = await this.memberRepo.findOne({ where: { user: { id: userId }, chat: { id: chatId } } });
        if (!member) return;
        await this.memberRepo.remove(member);
    }

    // Function to get all members of a chat except one
    async getAllMembersExceptOne(
        chatId: number,
        userId: number,
    ): Promise<ChatMember[]> {
        const members = await this.memberRepo.find({
            where: { 
                chat: { id: chatId }, 
                user: { id: Not(userId) } 
            },
            order: { joinDate: 'ASC' },
            relations: ['user'],
        });
        return members;
    }
}
