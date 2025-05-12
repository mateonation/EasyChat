import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Request, Response } from 'express';
import { MessagesService } from './messages.service';
import { Roles } from 'src/guards/roles.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { ForbiddenException } from 'src/errors/forbiddenException';
import { ChatsService } from '../chats/chats.service';
import { NotFoundException } from 'src/errors/notFoundException';

@UseGuards(RolesGuard)
@Controller('api/messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly chatsService: ChatsService,
    ) {}

    @Post('send')
    @Roles('user')
    async sendMessage(
        @Body() dto: SendMessageDto,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            if (!req.session.user?.id) return;
            // Check if chat exists
            const chatDoesExist = await this.chatsService.findById(dto.chatId);
            if (!chatDoesExist) {
                throw new NotFoundException('Chat not found');
            }
            const message = await this.messagesService.sendMessage(req.session.user.id, dto);
            return res.status(201).json({
                statusCode: 201,
                message: 'Message sent successfully',
                data: message,
            });
        } catch (error) {
            // Handle conflict error
            if (error instanceof ForbiddenException || error instanceof NotFoundException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
            // If error is not handled by service, return 500
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
}
