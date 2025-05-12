import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
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

    @Delete('')
    @Roles('user')
    async deleteMessage(
        @Body('messageId') messageId: number,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            if (!req.session.user?.id) return;
            const requesterId = req.session.user.id;
            // Check if message exists
            const message = await this.messagesService.findById(messageId);
            // If message does not exist or is already deleted, throw a not found exception
            if (!message || message.isDeleted) {
                throw new NotFoundException('Message not found');
            }
            // If user requesting the deletion is not the sender of the message, throw an error
            if (message.senderId !== requesterId) {
                throw new ForbiddenException('You can only delete your own messages');
            }
            // Delete message
            await this.messagesService.deleteMessage(messageId);
            return res.status(200).json({
                statusCode: 200,
                message: 'Message deleted successfully',
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
