import { UserResponseDto } from "src/entities/users/dto/user-response.dto";

export class MemberResponseDto {
    role: string;
    joinDate: Date;
    user: UserResponseDto;
}