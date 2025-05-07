import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateIndividualChatDto } from './dto/create-chat.dto';
import { Request, Response } from 'express';
import { ForbiddenException } from 'src/errors/forbiddenException';
import { BadRequestException } from 'src/errors/badRequestException';
import { NotFoundException } from 'src/errors/notFoundException';

@UseGuards(RolesGuard)
@Controller('api/chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
    ) {}

    // Endpoint to create an individual chat between two users
    @Post('create/individual')
    @Roles('user')
    async createIndividualChat(
        @Body() body: CreateIndividualChatDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            if(!req.session.user?.id) return;
            // Throw forbidden exception if the user tries to create a chat for another user
            if(body.requesterId != req.session.user.id) throw new ForbiddenException('You are not allowed to create a chat for another user');
            // Throw bad request exception if the user tries to create a chat with themselves
            if(body.requesterId == body.otherUserId) throw new BadRequestException('You cannot create a chat with yourself');
            // Create chat
            const chat = await this.chatsService.createIndividualChat(body.requesterId, body.otherUserId);
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
