import { MemberResponseDto } from "src/entities/chatmembers/dto/member-response.dto";
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

    static fromChat(chat: Chat): ChatResponseDto {
        return new ChatResponseDto(chat);
    }

    static fromChats(chats: Chat[]): ChatResponseDto[] {
        return chats.map(chat => new ChatResponseDto(chat));
    }
}