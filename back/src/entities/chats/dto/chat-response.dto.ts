import { MemberResponseDto } from "src/entities/chatmembers/dto/member-response.dto";

export class ChatResponseDto {
    id: number;
    creationDate: Date;
    isGroup: boolean;
    name: string;
    groupDescription: string;
    members: MemberResponseDto[];
}