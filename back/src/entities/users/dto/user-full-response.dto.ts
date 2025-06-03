import { Role } from "../role/role";
import { User } from "../user.entity";

// DTO for full user info
// This DTO is meant only meant to be used for users to see their OWN data
export class UserFullResponseDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string | null; // Last name can be optional
    registerDate: Date;
    birthDate: Date;
    roles: string[];

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName || null; // Last name can be null if not provided
        this.registerDate = user.registerDate;
        this.birthDate = user.birthDate;
        this.roles = user.roles?.map((role: Role) => role.name) || [];
    }

    static fromUser(user: User): UserFullResponseDto {
        return new UserFullResponseDto(user);
    }
    static fromUsers(users: User[]): UserFullResponseDto[] {
        return users.map(user => new UserFullResponseDto(user));
    }
}
