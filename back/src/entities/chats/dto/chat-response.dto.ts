import { MemberResponseDto } from "../chatmembers/dto/member-response.dto";
import { Chat } from "../chat.entity";

export class ChatResponseDto {
    id: number;
    creationDate: Date;
    isGroup: boolean;
    name: string;
    description: string;
    lastMessagePreview?: string;
    members: MemberResponseDto[];

    constructor(chat: Chat) {
        this.id = chat.id;
        this.creationDate = chat.creationDate;
        this.isGroup = chat.isGroup;
        this.name = chat.name;
        this.description = chat.description;
        this.members = MemberResponseDto.fromMembers(chat.members);
    }

    static fromChat(chat: Chat, currentUserId?: number): ChatResponseDto {
        let name: string | undefined = chat.name;

        // Set the other member's username as the name of the chat if it's not a group chat and the current user ID is provided
        if (!chat.isGroup && currentUserId) {
            const otherMember = chat.members.find(m => m.user.id !== currentUserId);
            name = otherMember?.user.username ?? 'Unknown';
        }

        // Get last message sent (by date)
        const lastMessage = chat.messages?.length
            ? [...chat.messages].sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime())[0]
            : null;

        let lastMessagePreview = '';
        if (lastMessage) {
            const sender = lastMessage.user;
            const senderIsCurrentUser = sender.id === currentUserId;

            if(chat.isGroup) {
                lastMessagePreview = senderIsCurrentUser
                    ? `You: ${lastMessage.content}`
                    : `${sender.username}: ${lastMessage.content}`;
            } else {
                lastMessagePreview = senderIsCurrentUser
                    ? `You: ${lastMessage.content}`
                    : `${lastMessage.content}`;
            }
        }

        return {
            id: chat.id,
            creationDate: chat.creationDate,
            isGroup: chat.isGroup,
            name,
            description: chat.description,
            lastMessagePreview,
            members: MemberResponseDto.fromMembers(chat.members),
        };
    }

    static fromChats(chats: Chat[]): ChatResponseDto[] {
        return chats.map(chat => new ChatResponseDto(chat));
    }
}