import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from './chatmember.entity';
import { Chat } from '../../chats/chat.entity';
import { User } from '../../users/user.entity';
import { ChatMemberRole } from 'src/types/chat-members-roles';
import { UserResponseDto } from 'src/entities/users/dto/user-response.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';

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
    async findChatMember(
        user: UserResponseDto,
        chat: ChatResponseDto,
    ): Promise<ChatMember | null> {
        return this.memberRepo.findOne({
            where: { user: { id: user.id }, chat: { id: chat.id } },
        });
    }

    // Function to add a user to a chat
    async addUserToChat(
        user: UserResponseDto,
        chat: Chat | ChatResponseDto,
    ): Promise<void> {
        const userEntity = await this.userRepo.findOne({ where: { id: user.id } });
        const chatEntity = await this.chatRepo.findOne({ where: { id: chat.id } });
        if (!userEntity || !chatEntity) return;
        const member = this.memberRepo.create({ user: userEntity, chat: chatEntity });
        await this.memberRepo.save(member);
    }

    // Function to update the role of a user in a chat
    async updateMemberRole(
        user: UserResponseDto,
        chat: Chat,
        role: ChatMemberRole,
    ) {
        const member = await this.memberRepo.findOne({ where: { user: { id: user.id }, chat: { id: chat.id } } });
        if (!member) return null;
        member.role = role;
        await this.memberRepo.save(member);
    }

    // Function to remove a user from a chat
    async removeUserFromChat(
        user: UserResponseDto,
        chat: Chat | ChatResponseDto,
    ): Promise<void> {
        const member = await this.memberRepo.findOne({ where: { user: { id: user.id }, chat: { id: chat.id } } });
        if (!member) return;
        await this.memberRepo.remove(member);
    }
}
