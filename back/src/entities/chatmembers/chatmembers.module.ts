import { Module } from '@nestjs/common';
import { ChatmembersService } from './chatmembers.service';
import { ChatmembersController } from './chatmembers.controller';

@Module({
  providers: [ChatmembersService],
  controllers: [ChatmembersController]
})
export class ChatmembersModule {}
