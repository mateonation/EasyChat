import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from './chatmember.entity';
import { Chat } from '../../chats/chat.entity';
import { User } from '../../users/user.entity';
import { ChatMemberRole } from 'src/types/chat-members-roles';
import { UserResponseDto } from 'src/entities/users/dto/user-response.dto';

@Injectable()
export class ChatmembersService {
    constructor(
        @InjectRepository(ChatMember)
        private readonly memberRepo: Repository<ChatMember>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    // Function to add a user to a chat
    async addUserToChat(
        user: UserResponseDto,
        chat: Chat,
    ): Promise<void> {
        const userEntity = await this.userRepo.findOne({ where: { id: user.id } });
        if (!userEntity) return;
        const member = this.memberRepo.create({ user: userEntity, chat });
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
}
