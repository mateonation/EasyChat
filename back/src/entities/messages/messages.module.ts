import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from '../chats/chatmembers/chatmember.entity';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';
import { Message } from './message.entity';
import { ChatsService } from '../chats/chats.service';
import { ChatmembersService } from '../chats/chatmembers/chatmembers.service';

@Module({
  providers: [MessagesService, ChatsService, ChatmembersService],
  imports: [TypeOrmModule.forFeature([Message, Chat, ChatMember, User])],
  controllers: [MessagesController],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
