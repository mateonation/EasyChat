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
import { CreateChatDto } from './dto/create-chat.dto';

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
        @Body() dto: CreateChatDto,
        @Param('typeChat') typeChat: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            if (!req.session.user?.id) return;
            const requesterId = req.session.user.id; // User authenticated by session
            if (!typeChat) throw new BadRequestException('Type of chat is required. Use "individual" or "group"');
            if (!dto.users || dto.users.length === 0) throw new BadRequestException('At least one user ID is required to create a chat');
            let chatId: number;
            switch (typeChat) {
                // Create an individual chat
                // An individual chat only has two members and cannot be repeated
                // If the chat already exists between two users, it will return it
                case 'individual':
                    if (dto.users.length !== 1) throw new BadRequestException('You must provide exactly one user ID to create an individual chat');
                    const otherUserId = dto.users[0]; // User to create chat with
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
                    chatId = chatCreated.id; // Get the ID of the created chat
                    // Add both users to the chat
                    await this.membersService.addUserToChat(requesterId, chatId);
                    await this.membersService.addUserToChat(otherUserId, chatId);
                    break;
                // Create a group chat
                // A group chat can have multiple members and can be created by any user
                case 'group':
                    if (dto.users.length < 2) throw new BadRequestException('You must provide at least two user IDs to create a group chat');
                    const usersToAdd = dto.users;
                    // Check one by one if the users provided on the body exist
                    // If any user does not exist, throw a NotFoundException
                    const requester = await this.usersService.findById(requesterId);
                    if (!requester) throw new NotFoundException(`User with ID ${req.session.user.id} not found`);
                    for (const userId of usersToAdd) {
                        // Check if the user exists
                        if (!(await this.usersService.findById(userId))) throw new NotFoundException(`User with ID ${userId} not found`);
                    }
                    // Create a new chat
                    const groupChatCreated = await this.chatsService.createChat();
                    if (!groupChatCreated) return;
                    chatId = groupChatCreated.id; // Get the ID of the created chat
                    // Update chat with group chat properties given by the requester
                    await this.chatsService.updateChat(chatId, {
                        name: dto.name ?? `Group - ${chatId}`,
                        groupDescription: dto.groupDescription ?? `Group chat created by user ${requester.username}.`,
                    });
                    // Add the requester to the chat
                    await this.membersService.addUserToChat(requesterId, chatId);
                    // Add the requester as creator of the chat
                    await this.membersService.updateMemberRole(requesterId, chatId, 'creator');
                    // Add all users to the chat
                    for (const userId of usersToAdd) {
                        await this.membersService.addUserToChat(userId, chatId);
                    }
                    break;
                // If the chat type is not valid, throw a bad request exception
                default:
                    return res.status(400).json({
                        statusCode: 400,
                        message: 'Invalid chat type. Use "individual" or "group"',
                    });
                }
                // If the chat was created successfully, return it
                // Fetch the chat with its members
                const chat = await this.chatsService.findById(chatId);
                return res.status(201).json({
                    statusCode: 201,
                    message: 'Group chat created successfully',
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
