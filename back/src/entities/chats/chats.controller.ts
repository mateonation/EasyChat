import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Request, Response } from 'express';
import { ForbiddenException } from 'src/errors/forbiddenException';
import { BadRequestException } from 'src/errors/badRequestException';
import { NotFoundException } from 'src/errors/notFoundException';
import { UsersService } from '../users/users.service';
import { ChatmembersService } from './chatmembers/chatmembers.service';
import { GroupParamsDto } from './dto/group-params.dto';
import { AddMembersDto } from './chatmembers/dto/add-members.dto';
import { ConflictException } from 'src/errors/conflictException';
import { ChatMemberRole } from 'src/common/enums/chat-members-roles.enum';
import { MessagesService } from '../messages/messages.service';

@UseGuards(RolesGuard)
@Controller('api/chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly usersService: UsersService,
        private readonly membersService: ChatmembersService,
        private readonly messageService: MessagesService,
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
            // If there are no chats for the user, return a message
            if (!chats || chats.length === 0) {
                return res.status(200).json({
                    statusCode: 200,
                    message: 'You have no chats yet',
                });
            }
            // If there are chats, return them
            return res.status(200).json(chats);
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

    // Get chat info by it's ID
    @Get(':chatId')
    @Roles('user')
    async viewChat(
        @Param('chatId') chatId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        // Check if the user in session exists
        if (!req.session.user?.id) return;
        const requester = await this.usersService.findById(req.session.user.id);
        if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);

        // Check if the chat exists
        const chat = await this.chatsService.findById(chatId, requester.id);
        if (!chat) throw new NotFoundException(`Chat with ID ${chatId} not found`);

        // Check if the requester is a member of the chat
        const member = await this.membersService.findChatMember(requester.id, chat.id);
        if (!member) throw new ForbiddenException('You are not a member of this chat');

        // Return chat with it's members
        return res.status(200).json({
            statusCode: 200,
            message: 'Chat info',
            chat,
        })
    }

    // Endpoint to create a chat
    // The type of chat can be either individual or group
    @Post('create/:typeChat')
    @Roles('user')
    async newChat(
        @Body() dto: GroupParamsDto,
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
                    const existingChat = await this.chatsService.findIndividualChat(requester.id, userToCreateChatWith.id);
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
                    await this.membersService.addUserToChat(requester.id, chatCreated.id);
                    await this.membersService.addUserToChat(userToCreateChatWith.id, chatCreated.id);
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
                    await this.chatsService.updateGroup(groupCreated.id, {
                        name: dto.name ?? `Group ${groupCreated.id}`,
                        description: dto.description ?? `Group chat created by user ${requester.username}.`,
                    });
                    // Add the requester to the group
                    await this.membersService.addUserToChat(requester.id, groupCreated.id);
                    // Add the requester as owner of the group
                    await this.membersService.updateMemberRole(requester.id, groupCreated.id, ChatMemberRole.OWNER);
                    // Add all users to the chat
                    for (const uid of uids) {
                        const u = await this.usersService.findById(uid);
                        if (!u) throw new NotFoundException(`User with ID ${uid} not found`);
                        await this.membersService.addUserToChat(u.id, groupCreated.id);
                    }
                    // Send 'group created' system message to the chat
                    await this.messageService.sendSystemMessage(
                        groupCreated.id,
                        'GROUP_CREATED',
                        {
                            username: requester.username,
                        }
                    );
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
            const chat = await this.chatsService.findById(chatId, requester.id);
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

    // Add members to a group chat
    @Post(':chatId/members/add')
    @Roles('user')
    async addToGroup(
        @Param('chatId') chatId: number,
        @Body() dto: AddMembersDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try{
            // Validate the request body
            if (!dto.userIds || dto.userIds.length === 0) throw new BadRequestException('At least one user ID is required to add members to the chat');

            // Check if the user in session exists
            if (!req.session.user?.id) return;
            const requester = await this.usersService.findById(req.session.user.id);
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);

            // Check if the chat exists + 
            const chat = await this.chatsService.findById(chatId, requester.id);
            if (!chat) throw new NotFoundException(`Chat with ID ${chatId} not found`);

            // Check if the requester is a member of the chat
            const member = await this.membersService.findChatMember(requester.id, chat.id);
            if (!member) throw new ForbiddenException('You are not a member of this chat');
            
            // Check if it's a group
            if (!chat.type || chat.type !== 'group') throw new ConflictException('You can only add members to group chats');

            // Check if the requester is a creator or admin of the chat
            if (member.role === 'member') throw new ForbiddenException('You are not allowed to add members to this chat');

            // Create an array to store usernames of the users to be added
            const addedUsernames: string[] = [];

            // Check if the users to be added exist
            for (const uid of dto.userIds) {
                const user = await this.usersService.findById(uid);
                if (!user) throw new NotFoundException(`User with ID ${uid} not found`);

                const alreadyAMember = await this.membersService.findChatMember(user.id, chat.id);
                if (alreadyAMember) throw new ConflictException(`${user.username} (ID: ${uid}) is already a member of this chat`);

                // Add the username to the array
                addedUsernames.push(user.username);
            }

            // Add users to the chat
            for (const uid of dto.userIds) {
                const user = await this.usersService.findById(uid);
                if (!user) throw new NotFoundException(`User with ID ${uid} not found`);
                await this.membersService.addUserToChat(user.id, chat.id);
            }
            if (addedUsernames.length > 1) {
                // Send system message of new members added to the group
                await this.messageService.sendSystemMessage(
                    chatId,
                    'NEW_MEMBERS',
                    {
                        admin: requester.username,
                        newMembers: addedUsernames.join(', '),
                    }
                );
            } else {
                // Send system message of the new member added to the group
                await this.messageService.sendSystemMessage(
                    chatId,
                    'NEW_MEMBER',
                    {
                        newMember: addedUsernames[0],
                        admin: requester.username,
                    }
                );
            }
            // Fetch the chat with its members
            const chatWithMembers = await this.chatsService.findById(chatId, requester.id);
            // Return the chat with its members
            return res.status(200).json({
                statusCode: 200,
                message: 'Members added successfully',
                chatWithMembers,
            });
        } catch (error) {
            if (error instanceof ForbiddenException || error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
            // If error is not handled by service, return 500
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }

    // Remove a member from a group chat
    @Delete(':chatId/member/:userId/rm')
    @Roles('user')
    async removeFromGroup(
        @Param('chatId') chatId: number,
        @Param('userId') userId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // User in session must exist and be a member of the group chat
            if (!req.session.user?.id) return;
            const requester = await this.usersService.findById(req.session.user.id);
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);
            const member = await this.membersService.findChatMember(requester.id, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Chat must exist and be a group chat
            const chat = await this.chatsService.findById(chatId, requester.id);
            if (!chat) throw new NotFoundException(`Chat with ID ${chatId} not found`);
            if (chat.type !== 'group') throw new ConflictException('You can only remove members from group chats');

            // User to be removed must exist and be a member of the group chat
            const userToRemove = await this.usersService.findById(userId);
            if (!userToRemove) throw new NotFoundException(`User with ID ${userId} not found`);
            const memberToRemove = await this.membersService.findChatMember(userToRemove.id, chat.id);
            if (!memberToRemove) throw new ConflictException(`${userToRemove.username} (ID: ${userId}) is not a member of this chat`);

            // If an user is trying to remove themselves from the group chat, let them do it
            if (userToRemove.id === requester.id) {

                // Check if the user removing itself is the owner of the group chat
                if (member.role === 'owner') {

                    // Get all other members of the group chat
                    const otherMembers = await this.membersService.getAllMembersExceptOne(chat.id, requester.id);

                    // If there are other members, assign the owner role to the oldest one
                    if (otherMembers.length > 0) {

                        // Get the first one from the array (it's the oldest one as it was ordered by the join date in the service)
                        const oldestMember = otherMembers[0];

                        // Update their role to owner
                        await this.membersService.updateMemberRole(oldestMember.user.id, chat.id, ChatMemberRole.OWNER);
                    
                    // If there are no other members, delete chat
                    } else {
                        // If there are no other members, delete the chat
                        await this.chatsService.deleteChatById(chat.id);
                        return res.status(200).json({
                            statusCode: 200,
                            message: `"${chat.name}" group was deleted as it had no other members`,
                        });
                    }
                }
                // Finally, let the user leave the chat
                await this.membersService.removeUserFromChat(userToRemove.id, chat.id);
                // Send system message of member leaving the group
                await this.messageService.sendSystemMessage(
                    chatId,
                    'MEMBER_LEFT',
                    {
                        username: requester.username,
                    }
                );
                return res.status(200).json({
                    statusCode: 200,
                    message: `You left the group "${chat.name}"`,
                });
            }

            // Check if the member removal can be done
            switch (member.role) {
                // If requester is owner, removal shall be made
                case 'owner':
                    break;
                // Admins can remove anyone but the owner
                case 'admin':
                    if(memberToRemove.role === 'owner') throw new ForbiddenException('You are not allowed to kick the owner out of the group')
                    break;
                // Other members are not allowed to remove other ones
                default:
                    if(memberToRemove.role === 'owner') throw new ForbiddenException("You don't have enough permission to kick members out of this group")
                    break;
            }

            // Kick member out of the chat
            await this.membersService.removeUserFromChat(userToRemove.id, chat.id);
            // Send system message of member kicking by the requester
            await this.messageService.sendSystemMessage(
                chatId,
                'MEMBER_KICKED',
                {
                    username: userToRemove.username,
                    admin: requester.username,
                }
            );
            return res.status(200).json({
                statusCode: 200,
                message: `${userToRemove.username} removed from chat ${chat.name}`,
            });
        } catch (error) {
            if (error instanceof ForbiddenException || error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
            // If error is not handled by service, return 500
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }

    // Edit the user role in a group chat
    @Patch(':chatId/:userId/role')
    @Roles('user')
    async editRole(
        @Param('chatId') chatId: number,
        @Param('userId') userId: number,
        @Body('role') role: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // User in session must exist and be a member of the group chat
            if (!req.session.user?.id) return;
            const requester = await this.usersService.findById(req.session.user.id);
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);
            const member = await this.membersService.findChatMember(requester.id, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Chat must exist and be a group chat
            const chat = await this.chatsService.findById(chatId, requester.id);
            if (!chat) throw new NotFoundException(`Chat with ID ${chatId} not found`);
            if (chat.type !== 'group') throw new ConflictException('You can only remove members from group chats');

            // User to be removed must exist and be a member of the group chat
            const userToEdit = await this.usersService.findById(userId);
            if (!userToEdit) throw new NotFoundException(`User with ID ${userId} not found`);
            const memberToEdit = await this.membersService.findChatMember(userToEdit.id, chat.id);
            if (!memberToEdit) throw new ConflictException(`${userToEdit.username} (ID: ${userId}) is not a member of this chat`);

            // Options if the user in request is changing it's role inside the group
            if(requester.id === userToEdit.id) {
                switch (memberToEdit.role) {
                    // Owners cannot edit their own role manually
                    case 'owner':
                        throw new ForbiddenException('You are the owner of the group, changing your role in the group is not possible');
                    // Admins only can downgrade their role to member
                    case 'admin':
                        if(role != ChatMemberRole.MEMBER) throw new ForbiddenException('You can only downgrade your role to member');
                        break;
                    // Members are not allowed to edit their own role
                    case 'member':
                        throw new ForbiddenException('You are not allowed to change your role in the group')
                }
                // Let the requester change it's role in group
                await this.membersService.updateMemberRole(userToEdit.id, chat.id, role as ChatMemberRole);
                return res.status(200).json({
                    statusCode: 200,
                    message: `You have changed your role in "${chat.name}" to "${role}"`,
                });
            }

            // Role to be given must not be owner
            if(role === ChatMemberRole.OWNER) throw new ForbiddenException("You can't assign 'owner' role to just anyone")
            
            // Prevent role change if the requester is a member
            if(member.role === ChatMemberRole.MEMBER) throw new ForbiddenException("You don't have permission to edit someone else's role");

            await this.membersService.updateMemberRole(userToEdit.id, chat.id, role as ChatMemberRole);
            return res.status(200).json({
                statusCode: 200,
                message: `You have changed the role of "${userToEdit.username}" in "${chat.name}" to "${role}"`,
            });             
        } catch (error) {
            if (error instanceof ForbiddenException || error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
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
