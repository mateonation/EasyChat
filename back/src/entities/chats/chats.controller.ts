import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
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
import { AddMembersDto } from './chatmembers/dto/add-members.dto';
import { ConflictException } from 'src/errors/conflictException';

@UseGuards(RolesGuard)
@Controller('api/chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly usersService: UsersService,
        private readonly membersService: ChatmembersService,
    ) { }

    // Get a list of all chats for the authenticated user
    @Get('my')
    @Roles('user')
    async getChatsAuthUser(
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            if (!req.session.user?.id) return;
            const requester = await this.usersService.findById(req.session.user.id); // User authenticated by session
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);
            // Get all chats for the user
            const chats = await this.chatsService.getChatsByUserId(requester.id);
            // Return the list of chats
            return res.status(200).json({
                statusCode: 200,
                message: 'Chats retrieved successfully',
                chats,
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
            if (!typeChat) throw new BadRequestException('Type of chat is required. Use "individual" or "group"');
            if (!dto.users || dto.users.length === 0) throw new BadRequestException('At least one user ID is required to create a chat');
            let chatId: number;
            // Check if the user in session exists
            const requester = await this.usersService.findById(req.session.user.id);
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);
            switch (typeChat) {
                // Create an individual chat
                // An individual chat only has two members and cannot be repeated
                // If the chat already exists between two users, it will return it
                case 'individual':
                    if (dto.users.length !== 1) throw new BadRequestException('You must provide exactly one user ID to create an individual chat');
                    // Throw bad request exception if the user tries to create a chat with themselves
                    if (requester.id === dto.users[0]) throw new BadRequestException('You cannot create a chat with yourself');
                    // Check if the user provided in the request exists
                    const userToCreateChatWith = await this.usersService.findById(dto.users[0]) // User to create chat with
                    if (!userToCreateChatWith) throw new NotFoundException(`User (ID: ${dto.users[0]}) not found`);
                    // If an individual chat between the two users already exists, return it instead of creating a new one
                    const existingChat = await this.chatsService.findIndividualChat(requester, userToCreateChatWith);
                    if (existingChat) { // If chat already exists, return it
                        return res.status(200).json({
                            statusCode: 200,
                            message: 'Chat already exists',
                            chat: existingChat,
                        });
                    }
                    // If not, create a new chat
                    const chatCreated = await this.chatsService.createChat();
                    // Add both users to the chat
                    await this.membersService.addUserToChat(requester, chatCreated);
                    await this.membersService.addUserToChat(userToCreateChatWith, chatCreated);
                    chatId = chatCreated.id; // Get the ID of the created chat
                    break;
                // Create a group chat
                // A group chat can have multiple members and can be created by any user
                case 'group':
                    // Filter out the requester ID from the list of users
                    const uids = dto.users.filter((uid) => uid !== requester.id);
                    if (uids.length === 0) throw new BadRequestException('You must provide at least one user ID to create a group chat');
                    for (const uid of uids) {
                        // Check if the user exists
                        if (!(await this.usersService.findById(uid))) throw new NotFoundException(`User with ID ${uid} not found`);
                    }
                    // Create a new chat
                    const groupCreated = await this.chatsService.createChat();
                    // Update chat with group chat properties given by the requester
                    await this.chatsService.updateChat(groupCreated.id, {
                        name: dto.name ?? `Group ${groupCreated.id}`,
                        description: dto.description ?? `Group chat created by user ${requester.username}.`,
                    });
                    // Add the requester to the chat
                    await this.membersService.addUserToChat(requester, groupCreated);
                    // Add the requester as creator of the chat
                    await this.membersService.updateMemberRole(requester, groupCreated, 'creator');
                    // Add all users to the chat
                    for (const uid of uids) {
                        const u = await this.usersService.findById(uid);
                        if (!u) throw new NotFoundException(`User with ID ${uid} not found`);
                        await this.membersService.addUserToChat(u, groupCreated);
                    }
                    chatId = groupCreated.id; // Get the ID of the created chat
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

    // Add a member to a group chat
    @Post(':chatId/members/add')
    @Roles('user')
    async addMemberToGroup(
        @Param('chatId') chatId: number,
        @Body() dto: AddMembersDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try{
            // Check if the user in session exists
            if (!req.session.user?.id) return;
            const requester = await this.usersService.findById(req.session.user.id);
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);

            // Check if the chat exists + 
            const chat = await this.chatsService.findById(chatId);
            if (!chat) throw new NotFoundException(`Chat with ID ${chatId} not found`);

            // Check if the requester is a member of the chat
            const member = await this.membersService.findChatMember(requester, chat);
            if (!member) throw new ForbiddenException('You are not a member of this chat');
            
            // Check if it's a group
            if (!chat.isGroup) throw new ConflictException('You can only add members to group chats');

            // Check if the requester is a creator or admin of the chat
            if (member.role === 'member') throw new ForbiddenException('You are not allowed to add members to this chat');

            // Check if the users to be added exist
            for (const uid of dto.userIds) {
                const user = await this.usersService.findById(uid);
                if (!user) throw new NotFoundException(`User with ID ${uid} not found`);

                const alreadyAMember = await this.membersService.findChatMember(user, chat);
                if (alreadyAMember) throw new ConflictException(`${user.username} (ID: ${uid}) is already a member of this chat`);
            }

            // Add users to the chat
            for (const uid of dto.userIds) {
                const user = await this.usersService.findById(uid);
                if (!user) throw new NotFoundException(`User with ID ${uid} not found`);
                await this.membersService.addUserToChat(user, chat);
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'Members added successfully',
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
