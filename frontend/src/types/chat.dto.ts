import { MemberDto } from "./member.dto";

export interface ChatDto {
    id: number;
    creationDate: string;
    type: string;
    name: string;
    description: string;
    updateDate: string;
    lastMessagePrefix: string;
    lastMessageContent: string;
    lastMessageSentDate: string;
    members: MemberDto[];
}