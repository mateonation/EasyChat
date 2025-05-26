import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { ChatMember } from './chatmembers/chatmember.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../users/role/role';
import { ChatmembersService } from './chatmembers/chatmembers.service';
import { MessagesService } from '../messages/messages.service';
import { Message } from '../messages/message.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatsService, UsersService, ChatmembersService, MessagesService, ChatGateway],
  imports: [TypeOrmModule.forFeature([Chat, ChatMember, User, Role, Message])],
  controllers: [ChatsController],
  exports: [TypeOrmModule],
})
export class ChatsModule {}
