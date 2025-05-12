import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember } from './chatmember.entity';
import { Chat } from '../chats/chat.entity';
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

    // Function to add a user to a chat
    async addUserToChat(
        userId: number,
        chatId: number,
    ) {
        const member = this.memberRepo.create({ userId, chatId, });
        await this.memberRepo.save(member);
    }

    // Function to remove a user from a chat
    // This function will throw an error if the user is not a member of the chat
    /*async removeUserFromChat(
        chatId: number,
        userId: number,
    ) {
        const member = await this.memberRepo.findOneByOrFail({
            chat: { id: chatId },
            user: { id: userId },
        });

        return this.memberRepo.remove(member);
    }*/
}
