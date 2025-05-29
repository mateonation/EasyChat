import { MemberDto } from "./member.dto";

export interface ChatDto {
    id: number;
    creationDate: Date;
    type: string;
    name: string;
    description: string;
    lastMessagePrefix: string;
    lastMessageContent: string;
    lastMessageSentDate: Date | null;
    members: MemberDto[];
}