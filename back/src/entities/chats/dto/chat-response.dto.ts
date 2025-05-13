import { MemberResponseDto } from "../chatmembers/dto/member-response.dto";
import { Chat } from "../chat.entity";

export class ChatResponseDto {
    id: number;
    creationDate: Date;
    isGroup: boolean;
    name: string;
    groupDescription: string;
    members: MemberResponseDto[];

    constructor(chat: Chat) {
        this.id = chat.id;
        this.creationDate = chat.creationDate;
        this.isGroup = chat.isGroup;
        this.name = chat.name;
        this.groupDescription = chat.groupDescription;
        this.members = MemberResponseDto.fromMembers(chat.members);
    }

    static fromChat(chat: Chat, currentUserId?: number): ChatResponseDto {
        let name: string | undefined = chat.name;
        // Set the other member's username as the name of the chat if it's not a group chat and the current user ID is provided
        if (!chat.isGroup && currentUserId) {
            const otherMember = chat.members.find(m => m.user.id !== currentUserId);
            name = otherMember?.user.username ?? 'Unknown';
        }
        return {
            id: chat.id,
            creationDate: chat.creationDate,
            isGroup: chat.isGroup,
            name,
            groupDescription: chat.groupDescription,
            members: MemberResponseDto.fromMembers(chat.members),
        };
    }

    static fromChats(chats: Chat[]): ChatResponseDto[] {
        return chats.map(chat => new ChatResponseDto(chat));
    }
}