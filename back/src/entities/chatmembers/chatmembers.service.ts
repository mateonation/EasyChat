import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from './chatmembers.entity';
import { Chat } from '../chats/chats.entity';
import { User } from '../users/user.entity';
import { ChatMemberRole } from 'src/types/chat-members-roles';

@Injectable()
export class ChatmembersService {
    constructor(
        @InjectRepository(ChatMember)
        private readonly memberRepo: Repository<ChatMember>,
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async addUserToChat(
        chatId: number,
        userId: number,
        role: ChatMemberRole = 'member',
    ) {
        const chat = await this.chatRepo.findOneByOrFail({ id: chatId });
        const user = await this.userRepo.findOneByOrFail({ id: userId });

        const member = this.memberRepo.create({
            chat,
            user,
            role,
            joinDate: new Date(),
        });

        return this.memberRepo.save(member);
    }
}
