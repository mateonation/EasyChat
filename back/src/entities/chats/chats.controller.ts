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
import { UpdateMemberRoleDto } from './chatmembers/dto/update-member-role.dto';
import { EditGroupParamsDto } from './dto/edit-group-params.dto';
import { ChatGateway } from './chat.gateway';

@UseGuards(RolesGuard)
@Controller('api/chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly userService: UsersService,
        private readonly membersService: ChatmembersService,
        private readonly messageService: MessagesService,
        private readonly chatGateway: ChatGateway,
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
            const reqId = req.session.user.id;

            // Get all chats for the user
            const chats = await this.chatsService.getChatsByUserId(reqId);

            // If there are no chats for user, return a message
            if (!chats || chats.length === 0) {
                return res.status(200).json(chats || []); // Return an empty array if no chats found
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
        try {
            if (!req.session.user?.id) return;
            const reqId = req.session.user.id

            // Check if the chat exists
            const chat = await this.chatsService.findById(chatId, reqId);
            if (!chat) throw new NotFoundException(`Chat with ID 4 does not exist`);

            // Check if the requester is a member of the chat
            const member = await this.membersService.findChatMember(reqId, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Return chat with it's members
            return res.status(200).json(chat);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                return res.status(error.getStatus()).json(error.getResponse());
            }
            // If error is not handled by service, return 500
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
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
            if (!typeChat) throw new BadRequestException('Type of chat is required. Use "private" or "group"');
            if (!dto.usernames || dto.usernames.length === 0) throw new BadRequestException('At least one user ID is required to create a chat');
            let chatId: number;
            // Check if the user in session exists
            const requester = await this.userService.getFullDataById(req.session.user.id);
            if (!requester) throw new NotFoundException(`User in session (ID: ${req.session.user.id}) not found`);
            switch (typeChat) {
                // Create a private chat
                // An private chat only has two members and cannot be repeated
                // If the chat already exists between two users, it will return it
                case 'private':
                    if (dto.usernames.length !== 1) throw new BadRequestException('You must provide exactly one user ID to create an individual chat');
                    // Throw bad request exception if the user tries to create a chat with themselves
                    if (requester.username === dto.usernames[0]) throw new BadRequestException('You cannot create a chat with yourself');
                    // Check if the user provided in the request exists
                    const userToCreateChatWith = await this.userService.getBasicDataByUsername(dto.usernames[0]) // User to create chat with
                    if (!userToCreateChatWith) throw new NotFoundException(`User (ID: ${dto.usernames[0]}) not found`);
                    // If an private chat between the two users already exists, return it instead of creating a new one
                    const existingChat = await this.chatsService.findPrivateChat(requester.id, userToCreateChatWith.id);
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
                    // Send 'chat created' system message to the chat
                    await this.messageService.sendSystemMessage(
                        chatCreated.id,
                        'PRIVCHAT_CREATED',
                        {
                            username: requester.username,
                            otherUser: userToCreateChatWith.username,
                        }
                    );
                    chatId = chatCreated.id; // Get the ID of the created chat
                    break;
                // Create a group chat
                // A group chat can have multiple members and can be created by any user
                case 'group':
                    // If body of request does not contain name, throw an exception
                    if (!dto.name) throw new BadRequestException('A name is required to create a group chat');

                    // Trim name and description
                    if (dto.description) dto.description = dto.description.trim();
                    dto.name = dto.name.trim();

                    // If the name is empty, throw an exception
                    if (dto.name === '') throw new BadRequestException('Group chat name cannot be empty');

                    // Filter out the requester username from the list of users
                    const unames = dto.usernames.filter((username) => username !== requester.username);
                    if (unames.length === 0) throw new BadRequestException('You must provide at least one user ID to create a group chat');

                    // Save all ids of the users to be added to the group chat
                    const userIds: number[] = [];
                    for (const uname of unames) {
                        // Check if the user exists
                        const user = await this.userService.getBasicDataByUsername(uname);
                        if (!user) throw new NotFoundException(`User with username '${uname}' not found`);

                        // If exists, add the user ID to the list of user IDs to be added to the group chat
                        userIds.push(user.id);
                    }
                    // Create a new chat
                    const groupCreated = await this.chatsService.createChat();
                    // Update chat with group chat properties given by the requester
                    await this.chatsService.updateGroup(groupCreated.id, dto.name, dto.description);
                    // Add the requester to the group
                    await this.membersService.addUserToChat(requester.id, groupCreated.id);
                    // Add the requester as owner of the group
                    await this.membersService.updateMemberRole(requester.id, groupCreated.id, ChatMemberRole.OWNER);
                    // Add all users to the chat
                    for (const uid of userIds) {
                        await this.membersService.addUserToChat(uid, groupCreated.id);
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
    @Post(':chatId/member')
    @Roles('user')
    async addToGroup(
        @Param('chatId') chatId: number,
        @Body() dto: AddMembersDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // Validate the request body
            if (!dto.usernames || dto.usernames.length === 0) throw new BadRequestException('At least one user ID is required to add members to the chat');

            if (!req.session.user?.id) return;
            const reqId = req.session.user.id;

            // Requester must be a member of the chat
            const member = await this.membersService.findChatMember(reqId, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Chat must be a group
            const chat = await this.chatsService.findById(chatId, reqId);
            if (!chat || chat.type !== 'group') throw new ConflictException(`You can only add members to group chats`);

            // Requester must not have the role of member in chat
            if (member.role === 'member') throw new ForbiddenException('You are not allowed to add members to this chat');

            // Save all IDs of the users to be added to the group chat
            const userIds: number[] = [];

            // Check if the users in the request body exist and are not already members of the chat
            // If any user does not exist or is already a member, DO NOT CONTINUE and throw an exception
            for (const username of dto.usernames) {
                const user = await this.userService.getBasicDataByUsername(username);
                if (!user) throw new NotFoundException(`${username} does not exist`);

                const alreadyAMember = await this.membersService.findChatMember(user.id, chat.id);
                if (alreadyAMember) throw new ConflictException(`${user.username} already a member`);

                // Collect user IDs to be added
                userIds.push(user.id);
            }

            // Add users to the chat
            for (const uid of userIds) {
                await this.membersService.addUserToChat(uid, chat.id);
            }

            let sysmsg;
            if (userIds.length > 1) {
                // Send system message of new members added to the group
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'NEW_MEMBERS',
                    {
                        admin: member.user.username,
                        newMembers: dto.usernames.join(', '),
                    }
                );
            } else {
                // Send system message of the new member added to the group
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'NEW_MEMBER',
                    {
                        newMember: dto.usernames[0],
                        admin: member.user.username,
                    }
                );
            }
            
            // Fetch the chat with its members
            const chatWithMembers = await this.chatsService.findById(chatId, reqId);
            if(!chatWithMembers) return;

            // Emit system message through chat gateway
            this.chatGateway.handleSendMessage({
                message: sysmsg,
                chatId: chatId,
            })

            // Emit system message through chat gateway
            this.chatGateway.emitChatUpdate(chatWithMembers);

            // Return chat with its members
            return res.status(200).json(chatWithMembers);
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
    @Delete(':chatId/member')
    @Roles('user')
    async removeFromGroup(
        @Param('chatId') chatId: number,
        @Body('rmId') rmId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // User in session must be a member of the group chat
            if (!req.session.user?.id) return;
            const reqId = req.session.user.id;
            const member = await this.membersService.findChatMember(reqId, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Chat be a group chat
            const chat = await this.chatsService.findById(chatId, reqId);
            if (!chat || chat.type !== 'group') throw new ConflictException('You can only remove members from group chats');

            // User to be removed must exist and be a member of the group chat
            const memberToRemove = await this.membersService.findChatMember(rmId, chatId);
            if (!memberToRemove) throw new NotFoundException(`User is not a member of this chat`);

            // If the user in request is removing itself from the group chat:
            if (rmId === reqId) {

                // Check if the user removing itself is the owner of the group chat
                if (member.role === 'owner') {

                    // Get all other members of the group chat
                    const otherMembers = await this.membersService.getAllMembersExceptOne(chatId, reqId);

                    // If there are other members, assign the owner role to the oldest one
                    if (otherMembers.length > 0) {

                        // Get the first one from the array (it's the oldest one as it was ordered by the join date in the service)
                        const oldestMember = otherMembers[0];

                        // Update their role to owner
                        await this.membersService.updateMemberRole(oldestMember.user.id, chatId, ChatMemberRole.OWNER);

                        // Send system message of new owner assigned
                        const sysmsg = await this.messageService.sendSystemMessage(
                            chatId,
                            'MEMBER_NOW_OWNER',
                            {
                                username: oldestMember.user.username,
                            }
                        );

                        // Emit system message through chat gateway
                        this.chatGateway.handleSendMessage({
                            message: sysmsg,
                            chatId: chatId,
                        });

                    } else {
                        // If there are no other members, delete the chat
                        await this.chatsService.deleteChatById(chatId);
                        return res.status(200).json({
                            statusCode: 200,
                            message: `"${chat.name}" group was deleted as it had no other members`,
                        });
                    }
                }
                // Finally, let the user leave the chat
                await this.membersService.removeUserFromChat(rmId, chat.id);
                // Send system message of member leaving the group
                const sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'MEMBER_LEFT',
                    {
                        username: member.user.username,
                    }
                );

                // Emit system message through chat gateway
                this.chatGateway.handleSendMessage({
                    message: sysmsg,
                    chatId: chatId,
                });

                // Get updated chat and send it through chat gateway
                const updatedChat = await this.chatsService.findById(chatId, reqId);
                if(!updatedChat) return;
                this.chatGateway.emitChatUpdate(updatedChat);

                return res.status(200).json({
                    statusCode: 200,
                    message: `You left the group "${chat.name}"`,
                });
            }

            // If the user to be removed is other one
            switch (member.role) {
                // If requester is owner, removal shall be made
                case 'owner':
                    break;
                // Admins can remove anyone else but the owner
                case 'admin':
                    if (memberToRemove.role === 'owner') throw new ForbiddenException('You are not allowed to kick the owner out of the group')
                    break;
                // Other members are not allowed to remove other ones
                default:
                    throw new ForbiddenException("You don't have enough permission to kick members out of this group")
            }

            // Kick member out of the chat
            await this.membersService.removeUserFromChat(rmId, chatId);

            // Send system message of member kicking by the requester
            const sysmsg = await this.messageService.sendSystemMessage(
                chatId,
                'MEMBER_KICKED',
                {
                    username: memberToRemove.user.username,
                    admin: member.user.username,
                }
            );

            // Emit system message through chat gateway
            this.chatGateway.handleSendMessage({
                message: sysmsg,
                chatId: chatId,
            });

            // Get updated chat and send it through chat gateway
            const updatedChat = await this.chatsService.findById(chatId, reqId);
            if(!updatedChat) return;
            this.chatGateway.emitChatUpdate(updatedChat);

            return res.status(200).json({
                statusCode: 200,
                message: `${memberToRemove.user.username} was removed from chat`,
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
    @Patch(':chatId/member/role')
    @Roles('user')
    async editRole(
        @Param('chatId') chatId: number,
        @Body() dto: UpdateMemberRoleDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // User in session must exist and be a member of the chat
            if (!req.session.user?.id) return;
            const reqId = req.session.user.id;
            const member = await this.membersService.findChatMember(reqId, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Chat must be a group
            const chat = await this.chatsService.findById(chatId, reqId);
            if (!chat || chat.type !== 'group') throw new ConflictException('You can only remove members from group chats');

            // User to have its role changed must be a member of the group
            const memberToEdit = await this.membersService.findChatMember(dto.editId, chatId);
            if (!memberToEdit) throw new NotFoundException(`User is not a member of this chat`);

            // If user in request is changing it's role inside the group
            if (reqId === dto.editId) {
                switch (memberToEdit.role) {
                    // The only users allowed to change their own role are admins and only to downgrade it to member
                    case 'admin':
                        if (dto.role != ChatMemberRole.MEMBER) throw new ForbiddenException('You can only downgrade your role to member');
                        break;
                    // Other members cannot change their own role
                    default:
                        throw new ForbiddenException('Cannot change your own role in this group');
                };
                // Let the requester change it's role in group
                await this.membersService.updateMemberRole(dto.editId, chatId, dto.role as ChatMemberRole);

                // Send system message of member role change
                const sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'MEMBER_NEW_ROLE',
                    {
                        username: member.user.username,
                        newRole: dto.role,
                    }
                );

                // Emit system message through chat gateway
                this.chatGateway.handleSendMessage({
                    message: sysmsg,
                    chatId: chatId,
                });

                // Get updated chat and send it through chat gateway
                const updatedChat = await this.chatsService.findById(chatId, reqId);
                if(!updatedChat) return;
                this.chatGateway.emitChatUpdate(updatedChat);

                return res.status(200).json({
                    statusCode: 200,
                    message: `You have changed your role in "${chat.name}" to "${dto.role}"`,
                });
            }

            // If user in request is changing the role of another user in the group:
            // Prevent role change if the requester is a member
            if (member.role === ChatMemberRole.MEMBER) throw new ForbiddenException("You don't have permission to edit someone else's role");

            // Role to be given must not be owner
            if (dto.role === ChatMemberRole.OWNER) throw new ForbiddenException("You can't assign 'owner' to other user")

            // If the role to grant is the same as the current one, throw a bad request exception
            if (memberToEdit.role === dto.role) throw new BadRequestException('User is already a ' + dto.role);

            // Update user role in the group chat
            await this.membersService.updateMemberRole(dto.editId, chatId, dto.role as ChatMemberRole);

            // Send system message of member role change by other user
            const sysmsg = await this.messageService.sendSystemMessage(
                chatId,
                'MEMBER_NEW_ROLE_BY_OTHER',
                {
                    user1: memberToEdit.user.username,
                    newRole: dto.role,
                    user2: member.user.username,
                }
            );

            // Emit system message through chat gateway
            this.chatGateway.handleSendMessage({
                message: sysmsg,
                chatId: chatId,
            });

            // Get updated chat and send it through chat gateway
            const updatedChat = await this.chatsService.findById(chatId, reqId);
            if(!updatedChat) return;
            this.chatGateway.emitChatUpdate(updatedChat);

            return res.status(200).json({
                statusCode: 200,
                message: `You changed the role of "${memberToEdit.user.username}" to "${dto.role}"`,
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

    // Update name and description of a group chat
    @Patch(':chatId')
    @Roles('user')
    async updateGroupChat(
        @Param('chatId') chatId: number,
        @Body() dto: EditGroupParamsDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // User in session must exist and be a member of the chat
            if (!req.session.user?.id) return;
            const reqId = req.session.user.id;
            const member = await this.membersService.findChatMember(reqId, chatId);
            if (!member) throw new ForbiddenException('You are not a member of this chat');

            // Chat must be a group
            const chatToEdit = await this.chatsService.findById(chatId, reqId);
            if (!chatToEdit || chatToEdit.type !== 'group') throw new ConflictException('You can only update group chats');

            // Users with member role cannot edit group chat details
            if (member.role === ChatMemberRole.MEMBER) throw new ForbiddenException("You don't have permission to update this group chat");

            // If no name, description or the description's not going to be cleared, throw a bad request exception (as it won't change a thing)
            if (!dto.name && !dto.description && !dto.clearDescription) throw new BadRequestException('At least one of name or description must be provided');

            // Trim name and description
            dto.name = dto.name.trim();

            if(dto.clearDescription) {
                dto.description = '';
            } else{
                dto.description = dto.description?.trim()
            }

            // If name and description are the same as the current ones and description is not going to be cleared, throw a bad request exception (as it won't change a thing)
            if (
                (!dto.name || dto.name === chatToEdit.name) &&
                (!dto.description || dto.description === chatToEdit.description) &&
                !dto.clearDescription
            ) {
                throw new BadRequestException('No changes were made to the group chat');
            }

            // Change group chat properties
            const chatUpdated = await this.chatsService.updateGroup(chatId, dto.name, dto.description, dto.clearDescription);

            if (!chatUpdated) throw new ConflictException(`Unexpected error while updating group`);

            // Send system message to the group chat based on the properties changed and save it to be sent to the client
            let sysmsg;

            // Both name and description were changed
            if (
                chatUpdated.name != chatToEdit.name && 
                chatUpdated.description != chatToEdit.description && 
                !dto.clearDescription
            ) {
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'GROUP_NAME_DESCRIPTION_CHANGED',
                    {
                        admin: member.user.username,
                        newName: dto.name,
                    }
                );
            }
            // Only name was changed
            else if (
                chatUpdated.name != chatToEdit.name &&
                chatUpdated.description === chatToEdit.description && 
                !dto.clearDescription
            ) {
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'GROUP_NAME_CHANGED',
                    {
                        admin: member.user.username,
                        newName: dto.name,
                    }
                );
            }
            // Only description was changed
            else if (
                chatUpdated.name === chatToEdit.name &&
                chatUpdated.description != chatToEdit.description && 
                !dto.clearDescription
            ) {
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'GROUP_DESCRIPTION_CHANGED',
                    {
                        admin: member.user.username,
                    }
                );
            }
            // Name was changed but description cleared
            // Only name was changed
            else if (
                chatUpdated.name != chatToEdit.name && 
                dto.clearDescription
            ) {
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'GROUP_NAME_CHANGED_DESCRIPTION_CLEARED',
                    {
                        admin: member.user.username,
                        newName: dto.name,
                    }
                );
            }
            // Only description was cleared
            else if (
                chatUpdated.name === chatToEdit.name && 
                dto.clearDescription
            ) {
                sysmsg = await this.messageService.sendSystemMessage(
                    chatId,
                    'GROUP_DESCRIPTION_CLEARED',
                    {
                        admin: member.user.username,
                    }
                );
            }

            // Emit system message through chat gateway
            this.chatGateway.handleSendMessage({
                message: sysmsg,
                chatId: chatId,
            });

            // Get updated chat with its members
            const updatedChat = await this.chatsService.findById(chatId, reqId);
            if(!updatedChat) return;
            // Emit chat update through chat gateway
            this.chatGateway.emitChatUpdate(updatedChat);

            // Return chat updated to the client
            return res.status(200).json(updatedChat);
        } catch (error) {
            if (error instanceof ForbiddenException || error instanceof BadRequestException || error instanceof ConflictException) {
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
