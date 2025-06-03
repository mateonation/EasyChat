import { ChatMember } from "../chatmember.entity";

export class MemberResponseDto {
    id: number; // User's ID, retrieved from User Entity
    username: string; // User's username, retrieved from User Entity
    joinDate: Date; // Date when user joined chat
    role: string; // Role of user in chat
    description: string | null; // Description can be optional, retrieved from User Entity
    registerDate: Date; // Date when user registered, retrieved from User Entity

    constructor(member: ChatMember) {
        this.id = member.user.id; // id from user
        this.username = member.user.username; // username from user
        this.role = member.role; // role from member
        this.joinDate = member.joinDate; // joinDate from member
        this.description = member.user.description || null; // description from user, can be null
        this.registerDate = member.user.registerDate; // registerDate from user
    }
    static fromMember(member: any): MemberResponseDto {
        return new MemberResponseDto(member);
    }
    static fromMembers(members: any[]): MemberResponseDto[] {
        return members.map(member => MemberResponseDto.fromMember(member));
    }
}