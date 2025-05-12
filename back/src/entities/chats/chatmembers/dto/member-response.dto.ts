import { UserResponseDto } from "src/entities/users/dto/user-response.dto";

export class MemberResponseDto {
    role: string;
    joinDate: Date;
    user: UserResponseDto;

    constructor(role: string, joinDate: Date, user: UserResponseDto) {
        this.role = role;
        this.joinDate = joinDate;
        this.user = user;
    }
    static fromMember(member: any): MemberResponseDto {
        return new MemberResponseDto(
            member.role,
            member.joinDate,
            UserResponseDto.fromUser(member.user),
        );
    }
    static fromMembers(members: any[]): MemberResponseDto[] {
        return members.map(member => MemberResponseDto.fromMember(member));
    }
}