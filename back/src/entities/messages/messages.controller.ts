import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Request, Response } from 'express';
import { MessagesService } from './messages.service';
import { Roles } from 'src/guards/roles.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { ForbiddenException } from 'src/errors/forbiddenException';
import { ChatsService } from '../chats/chats.service';
import { NotFoundException } from 'src/errors/notFoundException';
import { ChatmembersService } from './../chats/chatmembers/chatmembers.service';

@UseGuards(RolesGuard)
@Controller('api/message')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly chatsService: ChatsService,
        private readonly membersService: ChatmembersService,
    ) {}

    // Send a message
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
            const chatDoesExist = await this.chatsService.findById(dto.chatId, req.session.user.id);
            if (!chatDoesExist) {
                throw new NotFoundException('Chat not found');
            }

            // Check if user is a member of the chat
            const member = await this.membersService.findChatMember(req.session.user.id, dto.chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Send the message and return it
            const message = await this.messagesService.sendMessage(dto, req.session.user.id);

            // If message is null, it means it was not saved correctly
            if (!message) throw new NotFoundException('Message could not be sent');

            // Return the message response
            return res.status(201).json(message);
        } catch (error) {
            console.log(error);
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

    // Remove message
    @Delete(':msgId/rm')
    @Roles('user')
    async deleteMessage(
        @Param('msgId') messageId: number,
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
            if (message.user.id !== requesterId) {
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

    // Get messages by chat ID
    @Get('from/:chatId')
    @Roles('user')
    async getMessagesByChatId(
        @Param('chatId', ParseIntPipe) chatId: number,
        @Query('page', ParseIntPipe) page: number = 1,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            if (!req.session.user?.id) return;
            const requesterId = req.session.user.id;

            // Check if user is a member of the chat
            const member = await this.membersService.findChatMember(requesterId, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Get messages by chat ID and return them
            const response = await this.messagesService.findMessagesByChatId(chatId, page);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
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
