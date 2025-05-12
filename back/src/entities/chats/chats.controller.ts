import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Request, Response } from 'express';
import { ForbiddenException } from 'src/errors/forbiddenException';
import { BadRequestException } from 'src/errors/badRequestException';
import { NotFoundException } from 'src/errors/notFoundException';
import { UsersService } from '../users/users.service';

@UseGuards(RolesGuard)
@Controller('api/chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly usersService: UsersService,
    ) {}

    // Endpoint to create an individual chat between two users
    @Post('create/individual')
    @Roles('user')
    async createIndividualChat(
        @Body() body: { otherUserId: number },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // Check if the requester and other user exist
            if(!req.session.user?.id) return;
            const requesterId = req.session.user?.id;
            console.log('Requester ID:', requesterId);
            console.log('Other User ID:', body.otherUserId);
            if (!requesterId || !(await this.usersService.findById(requesterId)) || !(await this.usersService.findById(body.otherUserId))) throw new NotFoundException('One or both users not found.');
            // Throw bad request exception if the user tries to create a chat with themselves
            if(requesterId == body.otherUserId) throw new BadRequestException('You cannot create a chat with yourself');
            // Check if the chat already exists
            const existingChat = await this.chatsService.findIndividualChat(requesterId, body.otherUserId);
            if (existingChat) {
                return res.status(200).json({
                    statusCode: 200,
                    message: 'Chat already exists',
                    chat: existingChat,
                });
            }
            // Create chat
            const chat = await this.chatsService.createIndividualChat(requesterId, body.otherUserId);
            return res.status(201).json({
                statusCode: 201,
                message: 'Chat created successfully',
                chat,
            });
        } catch (error) {
            if (error instanceof ForbiddenException || error instanceof BadRequestException || error instanceof NotFoundException) {
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
