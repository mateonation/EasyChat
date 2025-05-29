import { MemberResponseDto } from "../chatmembers/dto/member-response.dto";
import { Chat } from "../chat.entity";
import { ChatType } from "src/common/enums/chat-type.enum";
import { MessageType } from "src/common/enums/message-type.enum";

export class ChatResponseDto {
    id: number;
    creationDate: Date;
    type: ChatType;
    name: string;
    description: string;
    lastMessagePrefix: string;
    lastMessageContent: string;
    lastMessageSentDate: Date | null = null;
    members: MemberResponseDto[];

    constructor(chat: Chat) {
        this.id = chat.id;
        this.creationDate = chat.creationDate;
        this.type = chat.type;
        this.name = chat.name;
        this.description = chat.description;
        this.members = MemberResponseDto.fromMembers(chat.members);
    }

    static fromChat(chat: Chat, currentUserId?: number): ChatResponseDto {
        let name: string | undefined = chat.name;

        // Set the other member's username as the name of the chat if it's private and the current user ID is provided
        if (chat.type === ChatType.PRIVATE && currentUserId) {
            const otherMember = chat.members.find(m => m.user.id !== currentUserId);
            name = otherMember?.user.username ?? 'Unknown';
        }

        // Get last message sent (by date)
        const lastMessage = chat.messages?.length
            ? [...chat.messages].sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime())[0]
            : null;

        let lastMessagePrefix = '';
        let lastMessageContent = '';
        let lastMessageSentDate: Date | null = null;
        if (lastMessage) {
            // If the last message is a system message, set the prefix accordingly
            if (lastMessage.type === MessageType.SYSTEM) {
                lastMessagePrefix = `<system>`; // Prefix for system messages
            // If not a system message, set the prefix based on chat type, sender and the current user seeing it
            } else {
                const sender = lastMessage.user;
                const senderIsCurrentUser = sender.id === currentUserId;

                // Set the last message prefix based on the chat type and sender
                if (chat.type === ChatType.GROUP) {
                    lastMessagePrefix = senderIsCurrentUser
                        ? `<you>`
                        : `${sender.username}`;
                } else {
                    lastMessagePrefix = senderIsCurrentUser
                        ? `<you>`
                        : ``;
                }
            }

            // Set the last message content
            lastMessageContent = lastMessage.content;

            // If the message is deleted -> placeholder for deleted message
            if (lastMessage.isDeleted === true) lastMessageContent = '<msg_deleted>';
            else lastMessageContent = lastMessage.content;

            // Set the last message sent date
            lastMessageSentDate = lastMessage.sentDate;
        }

        return {
            id: chat.id,
            creationDate: chat.creationDate,
            type: chat.type,
            name,
            description: chat.description,
            lastMessagePrefix,
            lastMessageContent,
            lastMessageSentDate,
            members: MemberResponseDto.fromMembers(chat.members),
        };
    }

    static fromChats(chats: Chat[]): ChatResponseDto[] {
        return chats.map(chat => new ChatResponseDto(chat));
    }
}