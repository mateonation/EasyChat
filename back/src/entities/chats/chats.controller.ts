import { Body, Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Request, Response } from 'express';
import { ForbiddenException } from 'src/errors/forbiddenException';
import { BadRequestException } from 'src/errors/badRequestException';
import { NotFoundException } from 'src/errors/notFoundException';
import { UsersService } from '../users/users.service';
import { ChatmembersService } from './chatmembers/chatmembers.service';

@UseGuards(RolesGuard)
@Controller('api/chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly usersService: UsersService,
        private readonly membersService: ChatmembersService,
    ) { }

    // Endpoint to create an individual chat between two users
    @Post('create/:typeChat')
    @Roles('user')
    async newChat(
        @Body('usersId') users: number[],
        @Param('typeChat') typeChat: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            if (!req.session.user?.id) return;
            if (!typeChat) throw new BadRequestException('Type of chat is required. Use "individual" or "group"');
            if (!users) throw new BadRequestException('At least one user ID is required to create a chat');
            switch (typeChat) {
                // Create an individual chat
                // An individual chat only has two members and cannot be repeated
                // If the chat already exists between two users, it will return it
                case 'individual':
                    if (users.length !== 1) throw new BadRequestException('You must provide exactly one user ID to create an individual chat');
                    const requesterId = req.session.user.id; // User authenticated by session
                    const otherUserId = users[0]; // User to create chat with
                    // Check if the requester and other user exist
                    if (!requesterId || !(await this.usersService.findById(requesterId)) || !(await this.usersService.findById(otherUserId))) throw new NotFoundException('One or both users not found.');
                    // Throw bad request exception if the user tries to create a chat with themselves
                    if (requesterId == otherUserId) throw new BadRequestException('You cannot create a chat with yourself');
                    // Check if the chat already exists
                    const existingChat = await this.chatsService.findIndividualChat(requesterId, otherUserId);
                    if (existingChat) { // If chat already exists, return it
                        return res.status(200).json({
                            statusCode: 200,
                            message: 'Chat already exists',
                            chat: existingChat,
                        });
                    }
                    // If not, create a new chat
                    const chatCreated = await this.chatsService.createChat();
                    if (!chatCreated) return;
                    // Add both users to the chat
                    await this.membersService.addUserToChat(requesterId, chatCreated.id);
                    await this.membersService.addUserToChat(otherUserId, chatCreated.id);
                    // Fetch chat with its members
                    const chat = await this.chatsService.findById(chatCreated.id);
                    return res.status(201).json({
                        statusCode: 201,
                        message: 'Chat created successfully',
                        chat,
                    });
                // Create a group chat
                // A group chat can have multiple members and can be created by any user
                case 'group':
                    break;
                // If the chat type is not valid, throw a bad request exception
                default:
                    return res.status(400).json({
                        statusCode: 400,
                        message: 'Invalid chat type. Use "individual" or "group"',
                    });
                }
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
