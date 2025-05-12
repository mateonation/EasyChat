import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from './chatmember.entity';
import { Chat } from '../../chats/chat.entity';
import { User } from '../../users/user.entity';

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

    // Function to add a user to a chat
    async addUserToChat(
        userId: number,
        chatId: number,
    ) {
        const member = this.memberRepo.create({ userId, chatId, });
        await this.memberRepo.save(member);
    }

    // Function to remove a user from a chat
}
