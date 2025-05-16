import { ChatMember } from "../chatmember.entity";

export class MemberResponseDto {
    id: number; // User's ID
    username: string; // User's username
    joinDate: Date; // Date when user joined chat
    role: string; // Role of user in chat

    constructor(member: ChatMember) {
        this.id = member.user.id; // id from user
        this.username = member.user.username; // username from user
        this.role = member.role; // role from member
        this.joinDate = member.joinDate; // joinDate from member
    }
    static fromMember(member: any): MemberResponseDto {
        return new MemberResponseDto(member);
    }
    static fromMembers(members: any[]): MemberResponseDto[] {
        return members.map(member => MemberResponseDto.fromMember(member));
    }
}