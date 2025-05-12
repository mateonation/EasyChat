import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from '../chatmembers/chatmember.entity';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat, ChatMember, User])],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
