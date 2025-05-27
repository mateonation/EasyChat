import { Role } from "../role/role";
import { User } from "../user.entity";

export class UserResponseDto {
    id: number;
    username: string;
    registerDate: Date;
    birthDate: Date;
    roles: string[];

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.registerDate = user.registerDate;
        this.birthDate = user.birthDate;
        this.roles = user.roles?.map((role: Role) => role.name) || [];
    }

    static fromUser(user: User): UserResponseDto {
        return new UserResponseDto(user);
    }
    static fromUsers(users: User[]): UserResponseDto[] {
        return users.map(user => new UserResponseDto(user));
    }
}
