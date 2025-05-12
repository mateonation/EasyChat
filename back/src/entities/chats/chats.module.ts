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

@Module({
  providers: [ChatsService, UsersService, ChatmembersService],
  imports: [TypeOrmModule.forFeature([Chat, ChatMember, User, Role])],
  controllers: [ChatsController],
  exports: [TypeOrmModule],
})
export class ChatsModule {}
