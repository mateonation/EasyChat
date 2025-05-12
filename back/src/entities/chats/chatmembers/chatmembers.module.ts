import { Module } from '@nestjs/common';
import { ChatmembersService } from './chatmembers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from './chatmember.entity';
import { Chat } from '../../chats/chat.entity';
import { User } from '../../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMember, Chat, User])],
  providers: [ChatmembersService],
  exports: [TypeOrmModule],
})
export class ChatmembersModule {}
