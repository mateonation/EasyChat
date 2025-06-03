import { Role } from "../role/role";
import { User } from "../user.entity";

// DTO for limited user info
// This DTO returns only information of a user that's meant to be shared with other users
export class UserBasicResponseDto {
    id: number;
    username: string;
    description: string | null; // Description can be optional
    registerDate: Date;
    roles: string[];

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.description = user.description || null; // Description can be null if not provided
        this.registerDate = user.registerDate;
        this.roles = user.roles?.map((role: Role) => role.name) || [];
    }

    static fromUser(user: User): UserBasicResponseDto {
        return new UserBasicResponseDto(user);
    }
    static fromUsers(users: User[]): UserBasicResponseDto[] {
        return users.map(user => new UserBasicResponseDto(user));
    }
}
